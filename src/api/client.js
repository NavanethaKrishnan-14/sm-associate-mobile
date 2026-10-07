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
  const token = await readAccessToken();
  if (!token) throw new Error('Your login session has expired. Please sign in again.');

  const isCustomerDocument = /^\/customers\/[^/]+\/documents\/[^/]+$/i.test(path);

  // Customer documents use the backend's signed Cloudinary flow:
  // 1. Ask the backend for a short-lived Cloudinary signature.
  // 2. Upload the native Expo File directly to Cloudinary.
  // 3. Tell the backend to persist the verified Cloudinary metadata.
  // This avoids Vercel/Multer multipart parsing completely.
  if (isCustomerDocument) {
    const signatureResponse = await api.post(path + '/signature', {
      originalName: fileName,
      ...(fields || {})
    });

    const signatureData = signatureResponse?.data?.data;
    if (!signatureData?.signature || !signatureData?.uploadUrl || !signatureData?.publicId) {
      throw new Error('The server could not prepare the Cloudinary upload.');
    }

    let file;
    try {
      file = new File(asset.uri);
    } catch {
      throw new Error('Unable to access the selected document. Please choose the file again.');
    }

    if (!file.exists) {
      throw new Error('The selected document is no longer available. Please choose it again.');
    }

    const fileSize = Number(file.size || 0);
    if (!fileSize) {
      throw new Error('The selected document is empty or could not be read.');
    }

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', String(signatureData.apiKey));
    form.append('timestamp', String(signatureData.timestamp));
    form.append('signature', String(signatureData.signature));
    form.append('public_id', String(signatureData.publicId));

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 60000);

    try {
      const cloudinaryResponse = await expoFetch(signatureData.uploadUrl, {
        method: 'POST',
        headers: {Accept: 'application/json'},
        body: form,
        signal: controller.signal
      });

      const responseText = await cloudinaryResponse.text();
      let cloudinaryData = {};
      try {
        cloudinaryData = responseText ? JSON.parse(responseText) : {};
      } catch {
        cloudinaryData = {
          error: {message: responseText || 'Cloudinary returned an invalid response.'}
        };
      }

      if (!cloudinaryResponse.ok || !cloudinaryData?.secure_url || !cloudinaryData?.public_id) {
        throw new Error(
          cloudinaryData?.error?.message ||
          'Cloudinary could not upload the selected document.'
        );
      }

      const completeResponse = await api.post(path + '/complete', {
        originalName: fileName,
        publicId: cloudinaryData.public_id,
        secureUrl: cloudinaryData.secure_url,
        resourceType: cloudinaryData.resource_type || signatureData.resourceType,
        format: cloudinaryData.format || '',
        size: Number(cloudinaryData.bytes || fileSize),
        ...(fields || {})
      });

      if (completeResponse?.data?.success !== true) {
        throw new Error(
          completeResponse?.data?.message ||
          'The document uploaded to Cloudinary but could not be saved to the customer.'
        );
      }

      return completeResponse.data;
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('Document upload timed out. Please try again.');
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  // Keep the existing multipart route for car/loan documents.
  const fileType = String(
    asset.mimeType ||
    asset.type ||
    'application/octet-stream'
  );

  let file;
  try {
    file = new File(asset.uri);
  } catch {
    throw new Error('Unable to access the selected document. Please choose the file again.');
  }

  if (!file.exists) {
    throw new Error('The selected document is no longer available. Please choose it again.');
  }

  if (!Number(file.size || 0)) {
    throw new Error('The selected document is empty or could not be read.');
  }

  const form = new FormData();
  form.append('file', file);

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await expoFetch(API_BASE_URL + path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'x-access-token': token
      },
      body: form,
      signal: controller.signal
    });

    const responseText = await response.text();
    let data = {};
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = {message: responseText || 'The server returned an invalid response.'};
    }

    if (response.status === 401) {
      await logout();
      notifyAuthExpired();
      throw new Error('Your login session has expired. Please sign in again.');
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Document upload failed with HTTP ' + response.status + '.');
    }

    if (data?.success !== true) {
      throw new Error(data?.message || 'Document upload was not confirmed by the server.');
    }

    return data;
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('Document upload timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
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
