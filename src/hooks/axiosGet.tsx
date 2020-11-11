import axios from 'axios';
import { User } from 'components/UsersDisplay';

export const getUser = (id: number): void => {
  axios.get(`/user/${id}`).then(response => console.log(response));
};

// export const getUsers = (): Promise<User[]> => {
//   return axios.get('/users').then(response => {
//     return response.data;
//   });
// };

export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get('/users');
  return response.data;
};
