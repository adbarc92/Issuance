import axios from 'axios';
import { User } from 'components/UsersTable';

// Prepends `/api` to route
const api = axios.create({ baseURL: '/api' });

export const getUser = (id: number): void => {
  api.get(`/user/${id}`).then(response => console.log(response));
};

// export const getUsers = (): Promise<User[]> => {
//   return axios.get('/users').then(response => {
//     return response.data;
//   });
// };

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get('/users');
  return response.data;
};