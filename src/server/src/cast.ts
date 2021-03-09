import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { Person as EPerson } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { Project as IProject } from '../../types/project';
import { camelCasify } from 'utils';

export const castTask = (task: ETask): ITask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

export const castPerson = (person: EPerson): IPerson => {
  return camelCasify({ ...person });
};

export const castProject = (
  project: EProject,
  tasks: ETask[],
  people: EPerson[]
): IProject => {
  return camelCasify({
    tasks,
    people,
    ...project,
  });
};
