import { randomBytes, createHmac } from 'crypto';
import { v4 as uuid } from 'uuid';

import { ClientTask } from '../../types/task';
import {
  ServerComment,
  ClientComment,
  commentEntityWithPersonEntity,
} from '../../types/comment';
import { Person } from '../../types/person';
import { UpdateItemTypes } from '../../types/updateItem';
import { SocketEventType } from '../../types/subscription';

import { ImgurTokenEntity } from 'entity/ImgurToken';
import { SubscriptionEntity } from 'entity/Subscription';
import { CommentEntity } from 'entity/Comment';

import { ProjectService } from 'services/projects.services';
import { TaskService } from 'services/tasks.services';
import { PersonService } from 'services/personnel.services';

// * Standardizes error messages for later handling, client-side
export const createErrorResponse = (errors: string[]): string => {
  return JSON.stringify({ errors });
};

export const generateRandomString = (length: number): string => {
  return randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

interface PasswordData {
  salt: string;
  passwordHash: string;
}

export const sha256 = (password: string, salt: string): PasswordData => {
  const hash = createHmac('sha256', salt);
  hash.update(password);
  const value = hash.digest('hex');
  return {
    salt,
    passwordHash: value,
  };
};

export const saltHashPassword = (userpassword: string): PasswordData => {
  const salt = uuid();
  return sha256(userpassword, salt);
};

export const toCamelCase = (str: string): string => {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '_' && str[i + 1] && i !== 0) {
      ret += str[i + 1].toUpperCase();
      i++;
    } else if (str[i] === '_') {
      continue;
    } else {
      ret += str[i];
    }
  }
  return ret;
};

export const camelCasify = (obj: any): any => {
  const retObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const newKey = toCamelCase(keys[i]);
    retObj[newKey] = obj[keys[i]];
  }
  return retObj;
};

export const toSnakeCase = (str: string): string => {
  let ret = '';
  for (let i = 0; i < str.length; i++) {
    if (
      !['_', '.', ',', '"', '\\', '/'].includes(str[i]) &&
      str[i] === str[i].toUpperCase()
    ) {
      ret += '_' + str[i].toLowerCase();
    } else {
      ret += str[i];
    }
  }
  return ret;
};

export const snakeCasify = (obj: any): any => {
  const fixedObj = {};
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const newKey = toSnakeCase(keys[i]);
    fixedObj[newKey] = obj[keys[i]];
    if (typeof obj[keys[i]] === 'object' && obj[keys[i]] !== null) {
      fixedObj[newKey] = snakeCasify(obj[keys[i]]);
    }
  }
  return fixedObj;
};

export const fixInputTask = (task: Partial<ClientTask>): void => {
  if (!task.reportedBy) {
    task.reportedBy = null;
  }
  if (!task.assignedTo) {
    task.assignedTo = null;
  }
};

export const fixOutputComment = (
  comment: ServerComment,
  commenter: Person
): ClientComment => {
  return {
    ...comment,
    commenter,
  };
};

export type IoRequest = Request & { io: any };

export const tokenIsExpired = (token: ImgurTokenEntity): boolean => {
  const currentDate = new Date();
  if (token.expires_at > currentDate) {
    return false;
  }
  return true;
};

export const getSubscriptionItemName = async (
  subscription: SubscriptionEntity
): Promise<string> => {
  const { subscribed_item_type, subscribed_item_id } = subscription;

  switch (subscribed_item_type) {
    case UpdateItemTypes.COMMENT:
    case UpdateItemTypes.TASK:
      const taskService = new TaskService();
      const task = await taskService.getTaskById(subscribed_item_id);
      console.log('taskName:', task.name);
      return task.name;
    case UpdateItemTypes.PROJECT:
      const projectService = new ProjectService();
      const project = await projectService.getProjectById(subscribed_item_id);
      return project.title;
  }
};

export const createSocketEventName = (
  socketEventType: SocketEventType,
  socketEventNumber: string
): string => {
  return socketEventType + socketEventNumber;
};

export const affixPersonToComment = async (
  comment: CommentEntity
): Promise<commentEntityWithPersonEntity> => {
  const personService = new PersonService();

  const commenter = await personService.getPersonById(comment.commenter_id);

  const fixedComment = {
    id: comment.id,
    index: comment.index,
    task_id: comment.task_id,
    commenter,
    header_comment_id: comment.header_comment_id,
    content: comment.content,
    created_at: comment.created_at,
    updated_at: comment.updated_at,
  };

  return fixedComment;
};
