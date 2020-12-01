import { api } from 'store/api';
import { Task as ITask } from 'types/task';
import { requestCache, CacheKey } from 'store/useGetData';

const updateCache = (obj: any, subCache?: any) => {
  const cache = subCache ?? requestCache;
  for (const i in cache) {
    const value = cache[i];
    // check if object
    if (Array.isArray(value)) {
      updateCache(obj, value);
    } else if (typeof value === 'object') {
      if (value.typeName === obj.typeName && value.id === obj.id) {
        cache[i] = obj;
      } else {
        updateCache(obj, value);
      }
    }
  }
};

export const updateTask = async (
  id: number,
  task: ITask
): Promise<ITask | null> => {
  try {
    const response = await api.put(`/task/${id}`, task);
    updateCache(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    // throw e;
    return null;
  }
};
