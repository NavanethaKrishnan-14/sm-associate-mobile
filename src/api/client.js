import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1';

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
  const {data} = await api.post('/auth/login', {email, password});
  const token = data?.data?.token || data?.token;
  if (token) await AsyncStorage.setItem('sm_access_token', token);
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem('sm_access_token');
}