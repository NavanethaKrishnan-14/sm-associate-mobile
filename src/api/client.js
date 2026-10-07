import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyAuthExpired} from './authEvents';
import * as FileSystem from 'expo-file-system/legacy';

const PRODUCTION_API_URL = 'https://sm-associate-backend.vercel.app/api/v1';

function normalizeApiUrl(value) {
  let url = String(value || '').trim().replace(/,+$/g, '').replace(/\/$/, '');
  if (!url) return '';

  // Accept both:
  //   https://sm-associate-backend.vercel.app
  //   https://sm-associate-backend.vercel.app/api/v1
  // and protect against an accidental /api/v1/api/v1.
  url = url.replace(/\/api\/v1\/api\/v1$/i, '/api/v1');
  if (!/\/api\/v1$/i.test(url)) url += '/api/v1';
  return url;
}

const configuredApiUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_BASE_URL);
export const API_BASE_URL = configuredApiUrl || PRODUCTION_API_URL;

async function readAccessToken() {
  const keys = ['sm_access_token', 'accessToken', 'token'];
  for (const key of keys) {
    const value = await AsyncStorage.getItem(key);
    if (value && value.trim()) return value.trim();
  }
  return null;
}

async function storeAccessToken(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken) throw new Error('The server did not return a valid access token.');
  await AsyncStorage.multiSet([
    ['sm_access_token', cleanToken],
    ['accessToken', cleanToken],
    ['token', cleanToken]
  ]);
  return cleanToken;
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {'Content-Type': 'application/json', Accept: 'application/json'}
});

api.interceptors.request.use(async config => {
  const token = await readAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = 'Bearer ' + token;
    config.headers['x-access-token'] = token;
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  async error => {
    if (error?.response?.status === 401) {
      await AsyncStorage.multiRemove(['sm_access_token', 'accessToken', 'token']);
      notifyAuthExpired();
    }
    return Promise.reject(error);
  }
);

export async function login(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  try {
    const response = await api.post('/auth/login', {email: cleanEmail, password: cleanPassword});
    const data = response.data;
    const token = data?.data?.token || data?.data?.accessToken || data?.token || data?.accessToken;

    if (!token) throw new Error('Login succeeded, but the server did not return an access token.');

    await storeAccessToken(token);

    // Verify the newly issued JWT before allowing the user into protected screens.
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      await logout();
      throw new Error('Login succeeded, but the authentication session could not be verified.');
    }

    return data;
  } catch (error) {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    if (serverMessage) throw new Error(serverMessage);
    if (status) throw new Error(`Login failed with HTTP ${status} at ${API_BASE_URL}.`);
    if (error?.code === 'ECONNABORTED') {
      throw new Error(`The server took too long to respond at ${API_BASE_URL}.`);
    }
    throw new Error(error?.message || `Cannot connect to SM Associate backend at ${API_BASE_URL}. Check the backend URL and your internet connection.`);
  }
}

export async function uploadDocument(path, asset, fields = {}) {
  if (!asset?.uri) throw new Error('Please select a document first.');

  const fileName = String(asset.name || asset.fileName || 'document');
  const fileType = String(asset.mimeType || asset.type || 'application/octet-stream');
  const token = await readAccessToken();
  if (!token) throw new Error('Your login session has expired. Please sign in again.');

  const match = String(path).match(/^\/customers\/([^/]+)\/documents\/([^/]+)$/);
  if (!match) throw new Error('Unsupported document upload path.');

  const customerId = decodeURIComponent(match[1]);
  const documentKey = decodeURIComponent(match[2]);
  const documentName = fields?.documentName ? String(fields.documentName) : '';

  let tempUri = asset.uri;
  let copiedTempFile = false;

  try {
    if (!String(tempUri).startsWith('file://')) {
      const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      tempUri = FileSystem.cacheDirectory + 'sm-upload-' + Date.now() + '-' + safeName;
      await FileSystem.copyAsync({from: asset.uri, to: tempUri});
      copiedTempFile = true;
    }

    const signatureResponse = await api.post(
      '/customers/' + encodeURIComponent(customerId) +
      '/documents/' + encodeURIComponent(documentKey) + '/signature',
      {originalName: fileName, ...(documentName ? {documentName} : {})}
    );

    const signed = signatureResponse?.data?.data;
    if (!signed?.uploadUrl || !signed?.signature || !signed?.apiKey) {
      throw new Error('The server could not prepare the Cloudinary upload.');
    }

    let cloudinaryResult;
    try {
      cloudinaryResult = await FileSystem.uploadAsync(signed.uploadUrl, tempUri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.MULTIPART,
        fieldName: 'file',
        mimeType: fileType,
        parameters: {
          api_key: String(signed.apiKey),
          timestamp: String(signed.timestamp),
          signature: String(signed.signature),
          public_id: String(signed.publicId)
        }
      });
    } catch (error) {
      throw new Error('Cloudinary upload failed: ' + (error?.message || String(error)));
    }

    let cloudData = {};
    try { cloudData = cloudinaryResult?.body ? JSON.parse(cloudinaryResult.body) : {}; } catch {}

    if (!cloudinaryResult || cloudinaryResult.status < 200 || cloudinaryResult.status >= 300) {
      throw new Error(cloudData?.error?.message || 'Cloudinary upload failed with HTTP ' + (cloudinaryResult?.status || 'unknown') + '.');
    }

    if (!cloudData?.public_id || !cloudData?.secure_url) {
      throw new Error('Cloudinary did not return a valid uploaded document.');
    }

    const completeResponse = await api.post(
      '/customers/' + encodeURIComponent(customerId) +
      '/documents/' + encodeURIComponent(documentKey) + '/complete',
      {
        originalName: fileName,
        documentName: documentName || undefined,
        publicId: cloudData.public_id,
        secureUrl: cloudData.secure_url,
        resourceType: cloudData.resource_type || signed.resourceType,
        format: cloudData.format || '',
        size: Number(cloudData.bytes || asset.size || 0)
      }
    );

    const completed = completeResponse?.data;
    if (completed?.success !== true) {
      throw new Error(completed?.message || 'The document uploaded to Cloudinary but could not be saved.');
    }

    return completed;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error?.message || 'Document upload failed. Please try again.');
  } finally {
    if (copiedTempFile && tempUri) {
      try { await FileSystem.deleteAsync(tempUri, {idempotent: true}); } catch {}
    }
  }
}

export async function getApiHealth() {
  const {data} = await api.get('/health');
  return data;
}

export async function logout() {
  await AsyncStorage.multiRemove(['sm_access_token', 'accessToken', 'token']);
}

export async function getCurrentUser() {
  const token = await readAccessToken();
  if (!token) return null;
  try {
    const {data} = await api.get('/auth/me', {
      headers: {Authorization: 'Bearer ' + token, 'x-access-token': token}
    });
    return data?.data ?? null;
  } catch (error) {
    if (error?.response?.status === 401) {
      await logout();
      return null;
    }
    throw error;
  }
}
