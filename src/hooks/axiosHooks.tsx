import { Person } from 'types/person';
import { Task } from 'types/task';
import { User } from 'types/user';
import { useGetData, CacheKey, IDataLoader } from 'hooks/getData';
import { api } from 'store/api';

// Temp

// Helper function for the hook below, not technically a hook
export const getPersonById = async (id: number): Promise<Person> => {
  const response = await api.get(`/personnel/${id}`);
  return response.data;
};

export const getPersonByUsername = async (
  username: string
): Promise<Person> => {
  const response = await api.get(`/personnel/${username}`);
  return response.data;
};

// This is a hook because it returns a function that contains a hook
export const useGetPersonById = (id: number): IDataLoader<Person> => {
  return useGetData(
    () => {
      return getPersonById(id);
    },
    CacheKey.PERSONNEL,
    String(id)
  );
};

export const useGetPersonByUsername = (
  username: string
): IDataLoader<Person> => {
  return useGetData(() => getPersonByUsername(username), CacheKey.PERSONNEL);
};

export const getPersonnel = async (): Promise<Person[] | null> => {
  try {
    const response = await api.get('/personnel');
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const useGetPersonnel = (): IDataLoader<Person[] | null> => {
  return useGetData(getPersonnel, CacheKey.PERSONNEL);
};

export const getTask = async (taskId: number): Promise<Task | null> => {
  try {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    // throw e;
    return null;
  }
};

export const useGetTask = (id: number): IDataLoader<Task | null> => {
  return useGetData(
    () => {
      return getTask(id);
    },
    CacheKey.TASKS,
    String(id)
  );
};

export const getTasks = async (): Promise<Task[] | null> => {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (e) {
    console.error(e);
    // throw e;
    return null;
  }
};

export const useGetTasks = (): IDataLoader<Task[] | null> => {
  return useGetData(getTasks, CacheKey.TASKS);
};

export const getUsers = async (): Promise<User[] | null> => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetUsers = (): IDataLoader<User[] | null> => {
  return useGetData(getUsers, CacheKey.USERS);
};
