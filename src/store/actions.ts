import { api } from 'store/api';
import { Task as ITask } from 'types/task';
import { requestCache, CacheKey } from 'store/useGetData';
import { Task, TaskPriority, TaskType, TaskStatus } from 'types/task';

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
    const response = await api.put(`/tasks/${id}`, task);
    updateCache(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    // throw e;
    return null;
  }
};

export const createTask = async (task: {
  name: string;
  summary: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
}): Promise<Task | null> => {
  try {
    // const tomorrowDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    const response = await api.post('/tasks', {
      name: task.name,
      summary: task.summary,
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
