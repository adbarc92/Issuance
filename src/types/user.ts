export enum UserRole {
  BOSS = 'boss',
  MIDDLER = 'middler',
  GRUNT = 'grunt',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // fix this?
}
