import { Person, PersonRole } from 'types/person';
import { Task } from 'types/task';
import { useGetData, CacheKey, IDataLoader } from 'hooks/getData';
import { api } from 'store/api';

// Temp

// Helper function for the hook below, not technically a hook
export const getPerson = async (id: number): Promise<Person> => {
  const response = await api.get(`/personnel/${id}`);
  return response.data;
};

// This is a hook because it returns a function that contains a hook
export const useGetPerson = (id: number): IDataLoader<Person> => {
  return useGetData(
    () => {
      return getPerson(id);
    },
    CacheKey.PERSONNEL,
    String(id)
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

export const createPerson = async (
  name: string,
  email: string,
  role: PersonRole
): Promise<Person | null> => {
  try {
    const response = await api.post('/personnel', { name, email, role });
    console.log(response);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
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
