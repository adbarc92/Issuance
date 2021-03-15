// Todo: modify castTask to include comments

import { camelCasify } from 'utils';
import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { Person as EPerson } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { Project as IProject } from '../../types/project';
import { User as EUser } from 'entity/User';
import { User as IUser } from '../../types/user';
import { Comment as CommentEntity } from 'entity/Comment';
import { Comment as IComment } from '../../types/comment';

export const castTask = (task: ETask): ITask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

export const castComment = (comment: CommentEntity): IComment => {
  return camelCasify({ ...comment });
};

export const castPerson = (person: EPerson): IPerson => {
  return camelCasify({ ...person });
};

export const castUser = (user: EUser): IUser => {
  return camelCasify({ ...user });
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
