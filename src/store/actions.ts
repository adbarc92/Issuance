// Todo: type for ProfilePicture actions should be better than 'any'

import { api } from 'store/api';
import { ClientTask, TaskInput } from 'types/task';
import { Person as IPerson } from 'types/person';
import { NewProject as IProject, ClientProject } from 'types/project';
import { ClientUser, UserInput } from 'types/user';
import { requestCache, CacheKey } from 'hooks/getData';
import { UpdateTaskResponse } from 'types/task';
import { ClientComment } from 'types/comment';
import { LoginResponse } from 'types/auth';
import { NewComment } from 'types/comment';
import { ClientNotification } from 'types/notification';

// * Actions change things

const updateCache = (obj: any, subCache?: any) => {
  const cache = subCache ?? requestCache;
  for (const i in cache) {
    const value = cache[i];
    if (Array.isArray(value)) {
      updateCache(obj, value);
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
  for (let i = 0; i < newArray.length; i++) {
    requestCache[cacheKey][i] = newArray[i];
  }
};

export const updateTask = async (
  id: string,
  task: TaskInput
): Promise<ClientTask | null> => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    handleUpdateTask(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const handleUpdateTask = (data: UpdateTaskResponse): void => {
  updateCache(data.task);
  updateCacheOrdering(data.ordering, CacheKey.TASKS);
};

// Todo: refactor with updateCache
export const handleUpdateComment = (comment: ClientComment): void => {
  const baseCacheKey = CacheKey.TASKS;
  const { taskId: id } = comment;
  const cacheKey = baseCacheKey + (id ?? '');
  requestCache[cacheKey].comments.push(comment); // Todo: add catching for cache miss
};

export const createTask = async (
  task: TaskInput
): Promise<ClientTask | null> => {
  try {
    const response = await api.post('/tasks', {
      name: task.name,
      description: task.description,
      type: task.type,
      priority: task.priority,
      status: task.status,
      assignedTo: 0,
      deadline: task.deadline,
      projectId: task.projectId,
      storyPoints: task.storyPoints,
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
): Promise<{ user: ClientUser | null; statusCode: number }> => {
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

export const updatePerson = async (
  person: Partial<IPerson> & { id: string }
): Promise<IPerson | null> => {
  try {
    const res = await api.put(`/personnel/${person.id}`, person);
    handleUpdatePerson(res.data);
    return res.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const handleUpdatePerson = (data: IPerson): void => {
  updateCache(data); // Todo: updateCache(data, requestCache[CacheKey.PERSONNEL]);
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
  project: IProject
): Promise<IProject | null> => {
  try {
    const response = await api.post('/projects', project);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateProject = async (
  project: IProject,
  id: string
): Promise<ClientProject | null> => {
  try {
    const response = await api.put(`projects/${id}`, project);
    return response.data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const createComment = async (
  comment: NewComment
): Promise<NewComment | null> => {
  try {
    const res = await api.post('/comments', comment);
    const { data } = res;
    handleUpdateComment(data);
    return data;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const setProfilePicture = async (
  form: FormData
): Promise<any | null> => {
  try {
    console.log('settingImage:', form);
    const res = await api.post('/image', form);
    console.log('pfp set res:', res); // * Troubleshooting
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getProfilePicture = async (
  personId: string
): Promise<any | null> => {
  try {
    const res = await api.get(`/image/${personId}`);
    console.log('pfp get res:', res); // * Troubleshooting
    return res;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const handleUpdateNotifications = (
  notification: ClientNotification
): void => {
  console.log('requestCache:', requestCache);
  const baseCacheKey = CacheKey.USERS;
  const { ownerId: id } = notification;
  const cacheKey = baseCacheKey + (id ?? '');
  console.log('cacheKey:', cacheKey);
  requestCache[cacheKey].notifications.push(notification);
};

// export const handleUpdateSubscriptions = async (subscription)
