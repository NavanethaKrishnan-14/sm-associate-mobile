import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
function normalizeApiUrl(value) {
  return String(value || '')
    .trim()
    .replace(/\:/g, ':')
    .replace(/,+$/g, '')
    .replace(/\/$/, '');
}

const configuredApiUrl = normalizeApiUrl(process.env.EXPO_PUBLIC_API_BASE_URL);

if (!configuredApiUrl) {
  throw new Error(
    'EXPO_PUBLIC_API_BASE_URL is required. Add it to the mobile .env file.'
  );
}

export const API_BASE_URL = configuredApiUrl;

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
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
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

export async function login(email, password) {
  const cleanEmail = String(email || '').trim().toLowerCase();
  const cleanPassword = String(password || '');

  try {
    const response = await api.post('/auth/login', {
      email: cleanEmail,
      password: cleanPassword
    });

    const data = response.data;
    const token = data?.data?.token || data?.data?.accessToken || data?.token || data?.accessToken;

    if (!token) {
      throw new Error(
        'Login succeeded, but the server did not return an access token.'
      );
    }

    await storeAccessToken(token);

    // Do not enter the application until the backend confirms that
    // the exact token we just stored is accepted by protected APIs.
    const meResponse = await api.get('/auth/me');
    if (!meResponse.data?.success) {
      throw new Error('Authentication succeeded, but the session could not be verified.');
    }

    return data;
  } catch (error) {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    if (serverMessage) {
      throw new Error(serverMessage);
    }

    if (status) {
      throw new Error(
        `Login failed with HTTP ${status} at ${API_BASE_URL}.`
      );
    }

    if (error?.code === 'ECONNABORTED') {
      throw new Error(
        `The server took too long to respond at ${API_BASE_URL}.`
      );
    }

    throw new Error(
      `Cannot connect to SM Associate backend at ${API_BASE_URL}. Check the backend URL and your internet connection.`
    );
  }
}

export async function uploadDocument(path, asset, fields = {}) {
  if (!asset?.uri) throw new Error('Please select a document first.');

  const form = new FormData();
  const fileName = String(asset.name || 'document');
  const lowerName = fileName.toLowerCase();
  const mimeType = asset.mimeType ||
    (lowerName.endsWith('.pdf') ? 'application/pdf' :
     lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') ? 'image/jpeg' :
     lowerName.endsWith('.png') ? 'image/png' :
     lowerName.endsWith('.webp') ? 'image/webp' :
     lowerName.endsWith('.doc') ? 'application/msword' :
     lowerName.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
     'application/octet-stream');

  form.append('file', {
    uri: asset.uri,
    name: fileName,
    type: mimeType
  });

  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) form.append(key, String(value));
  });

  const token = await readAccessToken();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  try {
    // Use fetch for multipart uploads. Do NOT set Content-Type here:
    // React Native must generate the multipart boundary itself.
    const response = await fetch(API_BASE_URL + path, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        ...(token ? {
          Authorization: 'Bearer ' + token,
          'x-access-token': token
        } : {})
      },
      body: form,
      signal: controller.signal
    });

    const text = await response.text();
    let data = {};
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { message: text || 'The server returned an invalid response.' };
    }

    if (!response.ok) {
      throw new Error(data?.message || 'Document upload failed with HTTP ' + response.status + '.');
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
  const { data } = await api.get('/health');
  return data;
}

export async function logout() {
  await AsyncStorage.multiRemove(['sm_access_token', 'accessToken', 'token']);
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data?.data ?? null;
}
