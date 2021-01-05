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
  id: string;
  name: string;
  description: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  createdOn: Date;
  assignedTo: number;
  rowIndex: number;
  deadline: Date | string;
  projectId: number;
  reportedBy: number;
  typeName: 'Task'; // this is server-side only
}
