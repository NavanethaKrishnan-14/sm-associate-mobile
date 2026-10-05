import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

function getExpoHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    '';

  return hostUri.split(':')[0] || '';
}

function normalizeApiUrl(value) {
  return String(value || '')
    .trim()
    .replace(/\\:/g, ':')
    .replace(/,+$/g, '')
    .replace(/\/$/, '');
}

const expoHost = getExpoHost();
const configuredApiUrl = normalizeApiUrl(
  process.env.EXPO_PUBLIC_API_BASE_URL
);

const configuredIsLoopback =
  configuredApiUrl.includes('localhost') ||
  configuredApiUrl.includes('127.0.0.1') ||
  configuredApiUrl.includes('10.0.2.2');

const localLanHost = expoHost || '192.168.1.10';
const detectedApiUrl = `http://${localLanHost}:5000/api/v1`;

export const API_BASE_URL =
  configuredApiUrl && !configuredIsLoopback
    ? configuredApiUrl
    : detectedApiUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('sm_access_token');

  if (token) {
    config.headers.Authorization = 'Bearer ' + token;
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
    const token = data?.data?.token || data?.token;

    if (!token) {
      throw new Error(
        'Login succeeded, but the server did not return an access token.'
      );
    }

    await AsyncStorage.setItem('sm_access_token', token);
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
      `Cannot connect to SM Associate backend at ${API_BASE_URL}. Check that the backend is running, Windows Firewall allows TCP 5000, and the phone and PC are on the same Wi-Fi.`
    );
  }
}

export async function getApiHealth() {
  const { data } = await api.get('/health');
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem('sm_access_token');
}
