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
import { SocketEventType, ServerSubscription } from '../../types/subscription';
import { ServerNotification } from '../../types/notification';
import { ServerUser } from '../../types/user';

import { ImgurTokenEntity } from 'entity/ImgurToken';
import { SubscriptionEntity } from 'entity/Subscription';
import { CommentEntity } from 'entity/Comment';
import { NotificationEntity } from 'entity/Notification';
import { PersonEntity } from 'entity/Person';
import { UserEntity } from 'entity/User';

import { ProjectService } from 'services/projects.services';
import { TaskService } from 'services/tasks.services';
import { UserService } from 'services/users.services';
import { PersonService } from 'services/personnel.services';
import { UpdateItemService } from 'services/updateItems.services';

import { Request } from 'express';
import { SubscriptionService } from 'services/subscriptions.services';
import { NotificationService } from 'services/notifications.services';

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

export const affixItemNameToSubscription = async (
  subscription: SubscriptionEntity
): Promise<ServerSubscription> => {
  const {
    id,
    subscribed_item_id,
    subscriber_id,
    subscribed_item_type,
    created_at,
  } = subscription;

  let subscribed_item_name = '';

  switch (subscribed_item_type) {
    case UpdateItemTypes.COMMENT:
    case UpdateItemTypes.TASK:
      const taskService = new TaskService();
      const task = await taskService.getTaskById(subscribed_item_id);
      subscribed_item_name = task.name;
    case UpdateItemTypes.PROJECT:
      const projectService = new ProjectService();
      const project = await projectService.getProjectById(subscribed_item_id);
      subscribed_item_name = project.title;
  }

  return {
    id,
    subscribed_item_id,
    subscriber_id,
    subscribed_item_type,
    created_at,
    subscribed_item_name,
  };
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

export const logThenEmit = (
  req: Request & { io: any; userId: string },
  socketEventName: string,
  res: any
) => {
  console.log('LOG THEN EMIT');
  console.log('socketEventName:', socketEventName);
  console.log('res:', res);

  req.io.emit(socketEventName, res);
};

export const getPersonName = (person: PersonEntity): string => {
  if (person.first_name && person.last_name) {
    return `${person.first_name} ${person.last_name}`;
  } else if (person.first_name) {
    return person.first_name;
  } else {
    return person.user_email;
  }
};

export const affixUpdateItemToNotification = async (
  notification: NotificationEntity
): Promise<ServerNotification | null> => {
  try {
    const {
      id,
      viewed,
      user_id: owner_id,
      update_item_id,
      created_at,
      subscription_id,
    } = notification;

    const updateItemService = new UpdateItemService();

    const updateItem = await updateItemService.getUpdateItemById(
      update_item_id
    );

    const {
      created_at: change_made_at,
      action_type,
      user_id: changer_id,
      item_id,
    } = updateItem;

    const userService = new UserService();
    const personService = new PersonService();
    const subscriptionService = new SubscriptionService();

    const subscription = await subscriptionService.getSubscriptionById(
      subscription_id
    );

    const {
      subscribed_item_name: item_name,
    } = await affixItemNameToSubscription(subscription);

    const user = await userService.getUserById(changer_id);

    const person = await personService.getPersonById(user.person_id);

    const changer_name = getPersonName(person);

    return {
      id,
      viewed,
      owner_id,
      created_at,
      changer_id,
      changer_name,
      action_type,
      change_made_at,
      item_id,
      item_name,
    };
  } catch (e) {
    console.error(e);
    console.log('Failed to affix UpdateItem to Notification');
    return null;
  }
};

export const affixNotificationsAndSubscriptionsToUser = async (
  user: UserEntity
): Promise<ServerUser> => {
  const notificationService = new NotificationService();

  const notificationEntities = await notificationService.getNotificationsByUserId(
    user.id
  );

  const notifications = notificationEntities
    ? await Promise.all(
        notificationEntities.map(async notificationEntity => {
          return await affixUpdateItemToNotification(notificationEntity);
        })
      )
    : [];

  const subscriptionService = new SubscriptionService();

  const subscriptionEntities = await subscriptionService.getSubscriptionsByUserId(
    user.id
  );

  const subscriptions = subscriptionEntities
    ? await Promise.all(
        subscriptionEntities.map(async subscriptionEntity => {
          return await affixItemNameToSubscription(subscriptionEntity);
        })
      )
    : [];

  const {
    id,
    email,
    person_id,
    role,
    created_at,
    updated_at,
    latest_activity,
  } = user;

  return {
    id,
    email,
    person_id,
    role,
    created_at,
    updated_at,
    latest_activity,
    notifications,
    subscriptions,
  };
};
