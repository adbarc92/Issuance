// Prepends `/api` to route
import axios from 'axios';

export const api = axios.create({ baseURL: '/api' });
