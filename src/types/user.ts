export enum UserRole {
  BOSS = 'BOSS',
  MIDDLER = 'MIDDLER',
  GRUNT = 'GRUNT',
}

export interface User {
  id: string;
  loginEmail: string;
  password: string;
  role: UserRole;
}

export interface UserInput {
  loginEmail: string;
  password: string;
  role: UserRole;
  id: string;
}
