import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

function getLanHost(){
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoClient?.hostUri || '';
  return hostUri.split(':')[0] || '127.0.0.1';
}

const lanHost = getLanHost();

const localApiUrl = `http://${lanHost}:5000/api/v1`;

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || localApiUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {'Content-Type':'application/json'}
});

api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('sm_access_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export async function login(email, password) {
  try {
    const {data} = await api.post('/auth/login', {email, password});
    const token = data?.data?.token || data?.token;
    if (!token) throw new Error('Login succeeded but the server did not return an access token.');
    await AsyncStorage.setItem('sm_access_token', token);
    return data;
  } catch (error) {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;
    if (serverMessage) throw new Error(serverMessage);
    if (status) throw new Error(`Login failed with HTTP ${status}.`);
    if (error?.code === 'ECONNABORTED') throw new Error(`The server took too long to respond at ${API_BASE_URL}.`);
    throw new Error(`Cannot connect to SM Associate backend at ${API_BASE_URL}. Make sure the backend is running and your phone and PC are on the same Wi-Fi.`);
  }
}

export async function logout() {
  await AsyncStorage.removeItem('sm_access_token');
}