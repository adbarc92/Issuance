import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';

export const castTask = (task: ETask): ITask => {
  return { ...task, typeName: 'Task' };
};
