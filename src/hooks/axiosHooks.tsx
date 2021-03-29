// Todo: Refactor--it is not a 404 if the requested data does not exist; If no matching entity exists, is that really an error?

import { Person } from 'types/person';
import { ClientTask } from 'types/task';
import { User } from 'types/user';
import { Project } from 'types/project';
import { useGetData, CacheKey, IDataLoader } from 'hooks/getData';
import { api } from 'store/api';

// * Helper function for the hook below, not technically a hook
export const getPersonById = async (
  personId: string
): Promise<Person | null> => {
  try {
    const res = await api.get(`/personnel/${personId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getPersonByUsername = async (
  username: string
): Promise<Person> => {
  const response = await api.get(`/personnel/${username}`);
  return response.data;
};

// * This is a hook because it returns a function that contains a hook
export const useGetPersonById = (id: string): IDataLoader<Person | null> => {
  return useGetData(
    () => {
      return getPersonById(id);
    },
    CacheKey.PERSONNEL,
    id
  );
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

export const getTask = async (taskId: string): Promise<ClientTask | null> => {
  try {
    const res = await api.get(`/tasks/${taskId}`);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const useGetTask = (id: string): IDataLoader<ClientTask | null> => {
  return useGetData(
    () => {
      return getTask(id);
    },
    CacheKey.TASKS,
    String(id)
  );
};

export const getTasks = async (): Promise<ClientTask[] | null> => {
  try {
    const res = await api.get('/tasks');
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const useGetTasks = (): IDataLoader<ClientTask[] | null> => {
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

export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const res = await api.get(`/projects/${projectId}`);
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetProjectById = (
  projectId: string
): IDataLoader<Project | null> => {
  return useGetData(
    () => {
      return getProjectById(projectId);
    },
    CacheKey.PROJECTS,
    projectId
  );
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetUserById = (userId: string): IDataLoader<User | null> => {
  return useGetData(
    () => {
      return getUserById(userId);
    },
    CacheKey.USERS,
    userId
  );
};

export const getUserPerson = async (userId: string): Promise<Person | null> => {
  try {
    const res = await api.get(`/users/person/${userId}`);
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetUserPersonById = (
  userId: string
): IDataLoader<Person | null> => {
  return useGetData(
    () => {
      return getUserPerson(userId);
    },
    CacheKey.USERS,
    userId
  );
};

export const getComments = async (): Promise<Comment[] | null> => {
  try {
    const res = await api.get('/comments');
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetComments = (): IDataLoader<Comment[] | null> => {
  return useGetData(getComments, CacheKey.COMMENTS);
};
