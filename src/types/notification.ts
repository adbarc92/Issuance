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
  createdAt: Date | string;
  changerName: string;
  actionType: UpdateItemActions;
  changeMadeAt: Date | string;
}

export interface ServerNotification {
  id: string;
  viewed: boolean;
  owner_id: string;
  created_at: Date | string;
  changer_id: string;
  changer_name: string;
  action_type: UpdateItemActions;
  change_made_at: Date | string;
  item_id: string;
  item_name: string;
}
