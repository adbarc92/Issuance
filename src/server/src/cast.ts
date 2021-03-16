// Todo: modify castTask to include comments

import { camelCasify } from 'utils';
import { Task as ETask } from 'entity/Task';
import { Task as ITask } from '../../types/task';
import { Person as PersonEntity } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { Project as IProject } from '../../types/project';
import { User as EUser } from 'entity/User';
import { User as IUser } from '../../types/user';
import { Comment as CommentEntity } from 'entity/Comment';
import { ClientComment, personedComment } from '../../types/comment';

export const castTask = (task: ETask): ITask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

export const castPersonedComment = (
  comment: personedComment
): ClientComment => {
  return camelCasify({ commenter: castPerson(comment.commenter), ...comment });
};

export const castPersonComment = (comment: CommentEntity): personedComment => {
  const {
    id,
    index,
    task_id,
    header_comment_id,
    content,
    created_at,
    updated_at,
  } = comment;
  return {
    id,
    index,
    task_id,
    commenter: {},
    header_comment_id,
    content,
    created_at,
    updated_at,
  };
};

// export const castComment = (
//   comment: CommentEntity,
//   person: PersonEntity
// ): ClientComment => {
//   return camelCasify({ commenter: person, ...comment });
// };

export const castPerson = (person: PersonEntity): IPerson => {
  return camelCasify({ ...person });
};

export const castUser = (user: EUser): IUser => {
  return camelCasify({ ...user });
};

export const castProject = (
  project: EProject,
  tasks: ETask[],
  people: PersonEntity[]
): IProject => {
  return camelCasify({
    tasks,
    people,
    ...project,
  });
};
