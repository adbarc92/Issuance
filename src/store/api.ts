// * Prepends `/api` to route
import axios from 'axios';
import { getSessionToken } from './auth';

export const api = axios.create({
  baseURL: '/api',
  headers: { session: getSessionToken() || '' },
});

api.interceptors.request.use(request => {
  console.log('Request:', request.url, request.method, request.data);
  return request;
});

api.interceptors.response.use(response => {
  console.log('Response:', response.data);
  return response;
});
