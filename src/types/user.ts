import { ClientNotification } from './notification';

export enum UserRole {
  BOSS = 'BOSS',
  MIDDLER = 'MIDDLER',
  GRUNT = 'GRUNT',
}

export interface ClientUser {
  id: string;
  loginEmail: string;
  personId: string;
  password: string;
  role: UserRole;
  createdAt: Date | string;
  // notifications?: ClientNotification[];
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
