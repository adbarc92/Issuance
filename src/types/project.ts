import { ClientTask } from 'types/task';

export interface ClientProject {
  id: string;
  title: string;
  description: string;
  deadline: Date | string | null;
  tasks: ClientTask[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: Date | string | null;
}

export interface NewProject {
  title: string;
  description: string;
  deadline: Date | string | null;
}
