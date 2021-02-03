import { Person } from 'types/person';

export interface Project {
  id: string;
  name: string;
  description: string;
  personnel: Person[];
  deadline: Date | string | null;
}
