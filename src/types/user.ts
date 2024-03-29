// Todo: implement proper user roles: administrator, guest, agent,

import { ClientNotification, ServerNotification } from './notification';
import { ClientSubscription, ServerSubscription } from './subscription';

export enum UserRole {
  BOSS = 'BOSS',
  MIDDLER = 'MIDDLER',
  GRUNT = 'GRUNT',
}

export interface ClientUser {
  id: string;
  email: string;
  personId: string;
  role: UserRole;
  createdAt: Date | string;
  updatedAt: Date | string;
  latestActivity: Date | string;
  notifications: ClientNotification[] | [];
  subscriptions: ClientSubscription[] | [];
}

export interface ServerUser {
  id: string;
  email: string;
  person_id: string;
  role: UserRole;
  created_at: Date | string;
  updated_at: Date | string;
  latest_activity: Date | string;
  notifications: ServerNotification[] | [];
  subscriptions: ServerSubscription[] | [];
}

export interface UserInput {
  loginEmail: string;
  password: string;
  role: UserRole;
}

export const UserRoleLabelsMap = {
  [UserRole.BOSS]: {
    label: 'Boss',
  },
  [UserRole.MIDDLER]: {
    label: 'Middler',
  },
  [UserRole.GRUNT]: {
    label: 'Grunt',
  },
};
