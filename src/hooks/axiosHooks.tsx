import { Person } from 'types/person';
import { Task } from 'types/task';
import { User } from 'types/user';
import { Project } from 'types/project';
import { useGetData, CacheKey, IDataLoader } from 'hooks/getData';
import { api } from 'store/api';

// Temp

// Helper function for the hook below, not technically a hook
export const getPersonById = async (
  personId: string
): Promise<Person | null> => {
  try {
    const res = await api.get(`/personnel/${personId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    // throw e;
    return null;
  }
};

export const getPersonByUsername = async (
  username: string
): Promise<Person> => {
  const response = await api.get(`/personnel/${username}`);
  return response.data;
};

// This is a hook because it returns a function that contains a hook
export const useGetPersonById = (id: string): IDataLoader<Person | null> => {
  return useGetData(
    () => {
      return getPersonById(id);
    },
    CacheKey.PERSONNEL,
    id
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

export const getTask = async (taskId: string): Promise<Task | null> => {
  try {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    // throw e;
    return null;
  }
};

export const useGetTask = (id: string): IDataLoader<Task | null> => {
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

export const getProjects = async (): Promise<Project[] | null> => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetProjects = (): IDataLoader<Project[] | null> => {
  return useGetData(getProjects, CacheKey.PROJECTS);
};
