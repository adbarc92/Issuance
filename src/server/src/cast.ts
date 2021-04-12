// Todo: modify castTask to include comments

import { camelCasify, getSubscriptionItemName } from 'utils';
import { Task as TaskEntity } from 'entity/Task';
import { ClientTask, CommentedTask } from '../../types/task';
import { Person as PersonEntity } from 'entity/Person';
import { Person as IPerson } from '../../types/person';
import { Project as EProject } from 'entity/Project';
import { ClientProject as IProject } from '../../types/project';
import { User as EUser } from 'entity/User';
import { ClientUser } from '../../types/user';
import { Comment as CommentEntity } from 'entity/Comment';
import { ClientComment, personedComment } from '../../types/comment';
import { UpdateItem as UpdateItemEntity } from 'entity/UpdateItem';
import { ClientUpdateItem } from '../../types/updateItem';
import { SubscriptionEntity } from 'entity/Subscription';
import { ClientSubscription } from '../../types/subscription';

// *** Object copying: Spread first, then overwrite

export const castTask = (task: TaskEntity): ClientTask => {
  return camelCasify({ ...task, typeName: 'Task' });
};

// Todo: refactor to shorten
export const castCommentedTask = (task: CommentedTask): ClientTask => {
  const comments = task.comments.map(comment => castPersonedComment(comment));

  const camelTask: ClientTask = camelCasify(task);

  return { ...camelTask, typeName: 'Task', comments };
};

export const castCommentTask = (task: TaskEntity): CommentedTask => {
  return { ...task, comments: [] };
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
  return { ...comment, commenter: {} };
};

export const castPerson = (person: PersonEntity): IPerson => {
  return camelCasify({ ...person });
};

export const castUser = (user: EUser): ClientUser => {
  return camelCasify({ ...user });
};

export const fixProject = (
  project: EProject,
  tasks: TaskEntity[],
  people: PersonEntity[]
): IProject => {
  return camelCasify({
    ...project,
    tasks,
    people,
  });
};

export const castProject = (project: EProject): IProject => {
  return camelCasify({ ...project });
};

export const castUpdateItem = (
  updateItem: UpdateItemEntity
): ClientUpdateItem => {
  return camelCasify({ ...updateItem });
};

// Todo: UpdateItem Bundler

export const castSubscription = (
  subscription: SubscriptionEntity
): ClientSubscription => {
  return camelCasify({
    ...subscription,
    subscribedItemName: getSubscriptionItemName(subscription),
  });
};
