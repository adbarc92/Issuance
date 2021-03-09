import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { Person as EPerson } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { camelCasify } from 'utils';

export const castTask = (task: ETask): ITask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

export const castPerson = (person: EPerson): IPerson => {
  return camelCasify({ ...person });
};
