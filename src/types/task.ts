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
  assignedTo: string;
  rowIndex: number;
  deadline: Date | string;
  projectId: string;
  reportedBy: string;
  storyPoints: number;
  typeName: 'Task'; // this is server-side only
}

export interface UpdateTaskResponse {
  task: Task;
  ordering: { id: string }[];
  userId: string;
}

export type TaskInput = Partial<Task> & Record<string, unknown>;
