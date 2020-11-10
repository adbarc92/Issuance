import axios from 'axios';

export const getUser = (id: number): void => {
  axios.get(`/user/${id}`).then(response => console.log(response));
};

export const getUsers = (): any => {
  // console.log('getting users');
  axios.get('/users').then(response => {
    console.log('response:', response);
    return response;
  });
};
