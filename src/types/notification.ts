import { UpdateItemActions } from './updateItem';

export enum NotificationTypes {
  TASKS = 'TASKS',
  COMMENTS = 'COMMENTS',
  PROJECTS = 'PROJECTS',
}

export interface ClientNotification {
  id: string;
  viewed: boolean;
  ownerId: string;
  changerId: string;
  changerFirstName: string;
  changerLastName: string;
  createdAt: Date | string;
  actionType: UpdateItemActions;
  changeMadeAt: Date | string;
}
