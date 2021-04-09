// Todo: ReportedBy and AssignedTo should be Persons, not strings

import { personedComment, ClientComment } from './comment';

// import { Person } from 'types/person';

export enum TaskPriority {
  HIGHEST = 'Highest',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
  LOWEST = 'Lowest',
}

export enum TaskType {
  FEATURE = 'Feature',
  BUG = 'Bug',
  EPIC = 'Epic',
}

export enum TaskStatus {
  BACKLOG = 'Backlog',
  ACTIVE = 'Active',
  COMPLETE = 'Complete',
}

export interface ClientTask {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  assignedTo: string; // Todo: make this a Person
  rowIndex: number;
  deadline: Date | string;
  projectId: string;
  reportedBy: string; // Todo: make this a Person
  storyPoints: number;
  typeName: 'Task'; // * Server-side only
  comments: ClientComment[];
  hidden: boolean;
}

export interface UpdateTaskResponse {
  task: ClientTask;
  ordering: { id: string }[];
  userId: string;
}

export type TaskInput = Partial<ClientTask> & Record<string, unknown>;

export interface CommentedTask {
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
  assigned_to: string;
  row_index: number;
  deadline: Date;
  project_id: string;
  reported_by: string;
  story_points: number;
  comments: personedComment[];
  hidden: boolean;
}
