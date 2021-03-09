export enum PersonJob {
  UI = 'UI',
  QA = 'QA',
  CODER = 'CODER',
  MANAGER = 'MANAGER',
}

export interface Person {
  id: string;
  userEmail: string;
  profilePicture: string;
  firstName: string;
  lastName: string;
  job: PersonJob;
}
