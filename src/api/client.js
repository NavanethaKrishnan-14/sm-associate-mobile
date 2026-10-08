import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyAuthExpired} from './authEvents';
import * as FileSystem from 'expo-file-system/legacy';

const PRODUCTION_API_URL = 'https://sm-associate-backend.onrender.com/api/v1';

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

  const fileName=String(asset.name||asset.fileName||'document');
  const mimeType=String(asset.mimeType||asset.type||'application/octet-stream');
  const token=await readAccessToken();
  if(!token) throw new Error('Your login session has expired. Please sign in again.');

  const fileSize=Number(asset.size||0);
  const MAX_DOCUMENT_SIZE=10*1024*1024;
  if(fileSize<0) throw new Error('The selected document could not be read.');
  if(fileSize>MAX_DOCUMENT_SIZE){
    throw new Error('Document is too large. Maximum allowed size is 10 MB.');
  }

  try{
    // Expo DocumentPicker can return Android cache/file URIs that the legacy
    // FileSystem.uploadAsync native module rejects as "isn't readable".
    // Fetching the local URI and putting the resulting Blob into FormData
    // avoids that native uploadAsync readability problem.
    let blob;
    try{
      const localResponse=await fetch(asset.uri);
      if(!localResponse.ok) throw new Error('Unable to read the selected document.');
      blob=await localResponse.blob();
    }catch(readError){
      console.error('Selected document read failed:',readError);
      throw new Error('The selected document could not be read. Please select the file again.');
    }

    const formData=new FormData();
    formData.append('file',blob,fileName);
    formData.append('originalName',fileName);

    Object.entries(fields||{}).forEach(([key,value])=>{
      if(value!==undefined&&value!==null) formData.append(key,String(value));
    });

    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),60000);

    let response;
    try{
      response=await fetch(API_BASE_URL+path,{
        method:'POST',
        headers:{
          Accept:'application/json',
          Authorization:'Bearer '+token,
          'x-access-token':token
          // Do not set Content-Type manually. React Native adds the multipart boundary.
        },
        body:formData,
        signal:controller.signal
      });
    }catch(error){
      if(error?.name==='AbortError') throw new Error('Document upload timed out. Please try again.');
      throw new Error(error?.message||'Unable to connect to the document upload server.');
    }finally{
      clearTimeout(timer);
    }

    let data={};
    try{
      const responseText=await response.text();
      data=responseText?JSON.parse(responseText):{};
    }catch{
      data={message:'The server returned an invalid response.'};
    }

    if(response.status===401){
      await logout();
      notifyAuthExpired();
      throw new Error('Your login session has expired. Please sign in again.');
    }

    if(!response.ok){
      throw new Error(
        data?.message||
        'Document upload failed with HTTP '+String(response.status)+'.'
      );
    }

    if(data?.success!==true){
      throw new Error(
        data?.message||
        'Document upload was not confirmed by the server.'
      );
    }

    return data;
  }catch(error){
    console.error('Document upload failed:',error);
    throw error;
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
