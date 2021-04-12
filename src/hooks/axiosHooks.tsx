// Todo: Refactor--it is not a 404 if the requested data does not exist; If no matching entity exists, is that really an error?

import { Person } from 'types/person';
import { ClientTask } from 'types/task';
import { ClientUser } from 'types/user';
import { ClientProject } from 'types/project';
import { ClientUpdateItem } from 'types/updateItem';
import { useGetData, CacheKey, IDataLoader } from 'hooks/getData';
import { api } from 'store/api';
import { ClientSubscription } from 'types/subscription';

export const getPersonByUsername = async (
  username: string
): Promise<Person> => {
  const response = await api.get(`/personnel/${username}`);
  return response.data;
};

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

export const getUsers = async (): Promise<ClientUser[] | null> => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetUsers = (): IDataLoader<ClientUser[] | null> => {
  return useGetData(getUsers, CacheKey.USERS);
};

export const getProjects = async (): Promise<ClientProject[] | null> => {
  try {
    const res = await api.get('/projects');
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetProjects = (): IDataLoader<ClientProject[] | null> => {
  return useGetData(getProjects, CacheKey.PROJECTS);
};

export const getProjectById = async (
  projectId: string
): Promise<ClientProject | null> => {
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
): IDataLoader<ClientProject | null> => {
  return useGetData(
    () => {
      return getProjectById(projectId);
    },
    CacheKey.PROJECTS,
    projectId
  );
};

export const getUserById = async (
  userId: string
): Promise<ClientUser | null> => {
  try {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  } catch (e) {
    console.error('Error occurred:', e);
    return null;
  }
};

export const useGetUserById = (
  userId: string
): IDataLoader<ClientUser | null> => {
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

export const getUpdateItems = async (): Promise<ClientUpdateItem[] | null> => {
  try {
    const res = await api.get('/notifications');
    console.log('res:', res);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const useGetUpdateItems = (): IDataLoader<ClientUpdateItem[] | null> => {
  return useGetData(getUpdateItems, CacheKey.UPDATE_ITEMS);
};

export const getUserSubscriptionsById = async (
  userId: string
): Promise<ClientSubscription[] | null> => {
  try {
    const res = await api.get(`/subscriptions/${userId}`);
    console.log('subscriptionRes:', res.data);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const useGetUserSubscriptionsById = (
  userId: string
): IDataLoader<ClientSubscription[] | null> => {
  return useGetData(
    () => {
      return getUserSubscriptionsById(userId);
    },
    CacheKey.SUBSCRIPTIONS,
    userId
  );
};
