import { api } from 'store/api';
import { Task as ITask } from 'types/task';
import { Person as IPerson } from 'types/person';
import { Project as IProject } from 'types/project';
import { User, UserInput } from 'types/user';
import { CacheKey, requestCache } from 'hooks/getData';
import { UpdateTaskResponse } from 'types/task';
import { LoginResponse } from 'types/auth';

// Actions change things

export type TaskInput = Partial<ITask> & Record<string, unknown>;

const updateCache = (obj: any, subCache?: any) => {
  const cache = subCache ?? requestCache;
  for (const i in cache) {
    const value = cache[i];
    // check if object
    if (Array.isArray(value)) {
      updateCache(obj, value);
      // Bug fix: typeof null === object
    } else if (value && typeof value === 'object') {
      if (
        value.typeName &&
        value.typeName === obj.typeName &&
        value.id === obj.id
      ) {
        cache[i] = obj;
      } else {
        updateCache(obj, value);
      }
    }
  }
};

// Should be generic,
export const updateCacheOrdering = (
  orderingArray: { id: string }[],
  cacheKey: CacheKey
): void => {
  const cache = requestCache[cacheKey];
  const hashedCache = cache.reduce((prev, current) => {
    prev[current.id] = current;
    return prev;
  }, {});
  const newArray = orderingArray.map((elem: { id: string }) => {
    return hashedCache[elem.id];
  });
  // requestCache[cacheKey] = newArray;
  for (let i = 0; i < newArray.length; i++) {
    requestCache[cacheKey][i] = newArray[i];
  }
};

export const updateTask = async (
  id: string,
  task: TaskInput
): Promise<ITask | null> => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    handleUpdateTask(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    // throw e;
    return null;
  }
};

export const handleUpdateTask = (data: UpdateTaskResponse): void => {
  updateCache(data.task);
  updateCacheOrdering(data.ordering, CacheKey.TASKS);
};

export const createTask = async (task: TaskInput): Promise<ITask | null> => {
  try {
    const response = await api.post('/tasks', {
      name: task.name,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      assignedTo: 0,
      deadline: task.deadline,
      projectId: 0,
      reportedBy: 0,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const deleteTask = async (taskId: string): Promise<undefined | null> => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const login = async (
  email: string,
  password: string
): Promise<string | null> => {
  try {
    const response = await api.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const checkLogin = async (): Promise<LoginResponse | null> => {
  try {
    const response = await api.put('/login', {});
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createUser = async (
  user: UserInput
): Promise<{ user: User | null; statusCode: number }> => {
  try {
    const response = await api.post('/users', {
      loginEmail: user.loginEmail,
      userPassword: user.password,
      userRole: user.role,
    });
    return { user: response.data, statusCode: 200 };
  } catch (e) {
    console.error(e);
    return { user: null, statusCode: e.response.status };
  }
};

export const createPerson = async (
  person: Partial<IPerson> & { userEmail: string }
): Promise<IPerson | null> => {
  try {
    const newPerson = {
      ...person,
      userEmail: person.userEmail,
    };
    const response = await api.post('/personnel', newPerson);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createProject = async (
  project: Partial<IProject>
): Promise<IProject | null> => {
  try {
    const response = await api.post('/projects/', project);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};
