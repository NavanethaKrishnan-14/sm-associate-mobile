import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PRODUCTION_API_URL = 'https://sm-associate-backend.onrender.com/api/v1';

function normalizeApiUrl(value) {
  return String(value || '')
    .trim()
    .replace(/,+$/g, '')
    .replace(/\/$/, '');
}

// Expo environment variables are embedded at build time. Always keep a
// production fallback so an APK built without the expected .env value does
// not accidentally point to localhost or an empty backend URL.
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

async function storeUser(user) {
  if (!user) return null;
  await AsyncStorage.setItem('sm_user', JSON.stringify(user));
  return user;
}

export async function getStoredUser() {
  try {
    const raw = await AsyncStorage.getItem('sm_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    await AsyncStorage.removeItem('sm_user');
    return null;
  }
}

let unauthorizedHandler=null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler=typeof handler==='function'?handler:null;
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
    const status = error?.response?.status;
    if (status === 401) {
      await AsyncStorage.multiRemove(['sm_access_token', 'accessToken', 'token', 'sm_user']);
      try { unauthorizedHandler?.(); } catch {}
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
    const meResponse=await api.get('/auth/me');
    const currentUser=meResponse.data?.data||data?.data?.user;
    if(!currentUser)throw new Error('Authentication succeeded, but the session could not be verified.');
    await storeUser(currentUser);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    if (serverMessage) throw new Error(serverMessage);
    if (status) throw new Error(`Login failed with HTTP ${status} at ${API_BASE_URL}.`);
    if (error?.code === 'ECONNABORTED') {
      throw new Error(`The server took too long to respond at ${API_BASE_URL}.`);
    }
    throw new Error(`Cannot connect to SM Associate backend at ${API_BASE_URL}. Check the backend URL and your internet connection.`);
  }
}

export async function uploadDocument(path, asset, fields = {}) {
  if (!asset?.uri) throw new Error('Please select a document first.');

  const fileName = String(asset.name || 'document');
  const lowerName = fileName.toLowerCase();
  const mimeType = asset.mimeType ||
    (lowerName.endsWith('.pdf') ? 'application/pdf' :
     lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') ? 'image/jpeg' :
     lowerName.endsWith('.png') ? 'image/png' :
     lowerName.endsWith('.webp') ? 'image/webp' :
     lowerName.endsWith('.doc') ? 'application/msword' :
     lowerName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
     lowerName.endsWith('.xls') ? 'application/vnd.ms-excel' :
     lowerName.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
     lowerName.endsWith('.ppt') ? 'application/vnd.ms-powerpoint' :
     lowerName.endsWith('.pptx') ? 'application/vnd.openxmlformats-officedocument.presentationml.presentation' :
     lowerName.endsWith('.txt') ? 'text/plain' :
     lowerName.endsWith('.csv') ? 'text/csv' :
     'application/octet-stream');

  const token = await readAccessToken();
  if (!token) {
    throw new Error('Your login session has expired. Please sign in again.');
  }

  /*
   * React Native 0.86 / Expo 57 can reject the old
   * { uri, name, type } FormData part with:
   * "Unsupported FormDataPart implementation".
   *
   * Convert the local DocumentPicker URI to a real Blob first.
   * Blob is a supported native FormData part and works for images,
   * PDFs and Office documents.
   */
  let blob;
  try {
    const fileResponse = await fetch(asset.uri);
    if (!fileResponse.ok) {
      throw new Error('Unable to read the selected document from device storage.');
    }
    blob = await fileResponse.blob();
  } catch (error) {
    throw new Error(error?.message || 'Unable to prepare the selected document for upload.');
  }

  const form = new FormData();
  form.append('file', blob, fileName);

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      form.append(key, String(value));
    }
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
        'x-access-token': token
        // Do NOT set Content-Type manually.
        // fetch adds the multipart boundary automatically.
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
  await AsyncStorage.multiRemove(['sm_access_token', 'accessToken', 'token', 'sm_user']);
}

export async function getCurrentUser() {
  const token=await readAccessToken();
  if(!token)return null;
  const {data}=await api.get('/auth/me');
  const user=data?.data??null;
  if(user)await storeUser(user);
  return user;
}
