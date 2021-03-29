import { ClientTask } from 'types/task';

export interface Project {
  id: string;
  title: string;
  description: string;
  deadline: Date | string | null;
  tasks: ClientTask[];
}

export interface NewProject {
  title: string;
  description: string;
  deadline: Date | string | null;
}
