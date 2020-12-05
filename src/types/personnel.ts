export enum PersonnelRole {
  BOSS = 'boss',
  MIDDLER = 'middler',
  GRUNT = 'grunt',
}

export interface Personnel {
  id: number;
  name: string;
  email: string;
  role: string; // fix this?
}
