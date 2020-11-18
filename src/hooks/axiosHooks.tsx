import axios, { AxiosResponse } from 'axios';
import { User } from 'components/UsersTable';
import { UserRole } from 'types/user';

// Temp

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

export const createUser = async (
  name: string,
  email: string,
  role: UserRole
): Promise<User | null> => {
  try {
    const response = await api.post('/users', { name, email, role });
    console.log(response);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// export const createUser = async (
//   name: string,
//   email: string,
//   role: string
// ): Promise<User> => {
//   const newUser = { name, email, role };
//   const response = await api.post('/users', {
//     newUser,
//   });
//   console.log(response);
//   return response.data;
// };
