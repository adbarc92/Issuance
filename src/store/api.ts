// Prepends `/api` to route
import axios from 'axios';
import { getSessionToken } from './auth';

export const api = axios.create({
  baseURL: '/api',
  headers: { session: getSessionToken() || '' },
});
