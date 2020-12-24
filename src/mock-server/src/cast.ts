import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { camelCasify } from 'utils';

export const castTask = (task: ETask): ITask => {
  return camelCasify({ ...task, typeName: 'Task' });
};
