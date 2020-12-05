export enum PersonRole {
  BOSS,
  MIDDLER,
  GRUNT,
}

export interface Person {
  id: number;
  name: string;
  email: string;
  role: PersonRole;
}
