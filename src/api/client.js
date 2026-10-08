import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {notifyAuthExpired} from './authEvents';
import {File, UploadType} from 'expo-file-system';

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
  timeout: 45000,
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
  if (!asset?.uri && !asset?._expoFile) {
    throw new Error('Please select a document first.');
  }

  const fileName=String(asset.name||asset.fileName||asset?._expoFile?.name||'document');
  const mimeType=String(asset.mimeType||asset.type||asset?._expoFile?.type||'application/octet-stream');
  const token=await readAccessToken();
  if(!token) throw new Error('Your login session has expired. Please sign in again.');

  const file=asset._expoFile || new File(asset.uri);
  const fileSize=Number(asset.size||file.size||0);
  const MAX_DOCUMENT_SIZE=10*1024*1024;

  if(fileSize>MAX_DOCUMENT_SIZE){
    throw new Error('Document is too large. Maximum allowed size is 10 MB.');
  }

  try{
    const parameters={originalName:fileName};
    Object.entries(fields||{}).forEach(([key,value])=>{
      if(value!==undefined&&value!==null) parameters[key]=String(value);
    });

    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),60000);

    let result;
    try{
      // Native Expo multipart upload. This bypasses React Native FormData
      // completely and works directly with DocumentPicker File instances.
      result=await file.upload(API_BASE_URL+path,{
        httpMethod:'POST',
        uploadType:UploadType.MULTIPART,
        fieldName:'file',
        mimeType,
        parameters,
        headers:{
          Accept:'application/json',
          Authorization:'Bearer '+token,
          'x-access-token':token
        },
        signal:controller.signal
      });
    }catch(error){
      if(error?.name==='AbortError') throw new Error('Document upload timed out. Please try again.');
      throw new Error(error?.message||'Unable to upload the selected document.');
    }finally{
      clearTimeout(timer);
    }

    let data={};
    try{
      data=result?.body?JSON.parse(result.body):{};
    }catch{
      data={message:'The server returned an invalid response.'};
    }

    if(result?.status===401){
      await logout();
      notifyAuthExpired();
      throw new Error('Your login session has expired. Please sign in again.');
    }

    if(!result || result.status<200 || result.status>=300){
      throw new Error(
        data?.message||
        'Document upload failed with HTTP '+String(result?.status||0)+'.'
      );
    }

    if(data?.success!==true){
      throw new Error(data?.message||'Document upload was not confirmed by the server.');
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
