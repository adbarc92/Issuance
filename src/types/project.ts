import { Person } from 'types/person';
import { Task } from 'types/task';

export interface Project {
  id: string;
  title: string;
  description: string;
  personnel: Person[] | null;
  deadline: Date | string | null;
  tasks: Task[];
}

export interface NewProject {
  title: string;
  description: string;
  personnel: Person[] | null;
  deadline: Date | string | null;
}
