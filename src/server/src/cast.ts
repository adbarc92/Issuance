import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { Person as EPerson } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { Project as IProject } from '../../types/project';
import { ProjectPersonnel as EProjectPersonnel } from 'entity/ProjectPersonnel';
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
  personnel: EPerson[]
): IProject => {
  return camelCasify({
    tasks,
    personnel,
    ...project,
  });
};

export const castProjectPerson = (
  projectPersonnel: EProjectPersonnel
): IProject => {
  return camelCasify({ ...projectPersonnel });
};
