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

export interface Task {
  assignedTo: number;
  completedBy: number;
  createdOn: string;
  deadline: string;
  description: string;
  id: number;
  project: number;
  reportedBy: number;
  name: string;
  summary: string;
  priority: TaskPriority;
  type: TaskType;
  status: TaskStatus;
}
