// Todo: modify castTask to include comments

import { camelCasify } from 'utils';
import { Task as TaskEntity } from 'entity/Task';
import { ClientTask, CommentedTask } from '../../types/task';
import { Person as PersonEntity } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { Project as IProject } from '../../types/project';
import { User as EUser } from 'entity/User';
import { User as IUser } from '../../types/user';
import { Comment as CommentEntity } from 'entity/Comment';
import { ClientComment, personedComment } from '../../types/comment';

export const castTask = (task: TaskEntity): ClientTask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

export const castCommentedTask = (task: CommentedTask): ClientTask => {
  const comments = task.comments.map(comment => castPersonedComment(comment));

  // console.log('comments:', comments);

  const camelTask: ClientTask = camelCasify(task);

  // const fixedTask = { comments, ...camelTask };

  // console.log('fixedTask:', fixedTask);

  // return fixedTask;

  const {
    id,
    name,
    description,
    type,
    priority,
    status,
    createdAt,
    updatedAt,
    assignedTo,
    rowIndex,
    deadline,
    projectId,
    reportedBy,
    storyPoints,
    hidden,
  } = camelTask;

  return {
    comments,
    id,
    name,
    description,
    type,
    priority,
    status,
    createdAt,
    updatedAt,
    assignedTo,
    rowIndex,
    deadline,
    projectId,
    reportedBy,
    storyPoints,
    hidden,
    typeName: 'Task',
  };
};

export const castCommentTask = (task: TaskEntity): CommentedTask => {
  const {
    id,
    name,
    description,
    type,
    priority,
    status,
    created_at,
    updated_at,
    assigned_to,
    row_index,
    deadline,
    project_id,
    reported_by,
    story_points,
    hidden,
  } = task;
  return {
    id,
    name,
    description,
    type,
    priority,
    status,
    created_at,
    updated_at,
    assigned_to,
    row_index,
    deadline,
    project_id,
    reported_by,
    story_points,
    comments: [],
    hidden,
  };
};

export const castPersonedComment = (
  comment: personedComment
): ClientComment => {
  const commenter = castPerson(comment.commenter);
  const clientComment = camelCasify(comment);
  clientComment.commenter = commenter;

  return clientComment;
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

export const castPerson = (person: PersonEntity): IPerson => {
  return camelCasify({ ...person });
};

export const castUser = (user: EUser): IUser => {
  return camelCasify({ ...user });
};

export const castProject = (
  project: EProject,
  tasks: TaskEntity[],
  people: PersonEntity[]
): IProject => {
  return camelCasify({
    tasks,
    people,
    ...project,
  });
};
