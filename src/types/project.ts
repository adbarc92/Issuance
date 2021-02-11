import { Person } from 'types/person';

export interface Project {
  id: string;
  title: string;
  description: string;
  personnel: Person[] | null;
  deadline: Date | string | null;
  // S/N: Tickets?!
}

export interface NewProject {
  title: string;
  description: string;
  personnel: Person[] | null;
  deadline: Date | string | null;
}
