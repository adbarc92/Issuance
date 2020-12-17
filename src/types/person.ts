export enum PersonJob {
  UI = 'UI',
  QA = 'QA',
  CODER = 'CODER',
  MANAGER = 'MANAGER',
}

export interface Person {
  id: string;
  name: string;
  email: string;
  role: PersonJob;
}
