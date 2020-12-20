export enum PersonJob {
  UI = 'UI',
  QA = 'QA',
  CODER = 'CODER',
  MANAGER = 'MANAGER',
}

export interface Person {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  role: PersonJob;
}
