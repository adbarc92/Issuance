import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { TaskPriority, TaskType, TaskStatus } from 'types/task';

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

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  project!: number;

  @Column()
  summary!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column('timestamp', {
    // name: 'deadline',
    default: (): string => 'LOCALTIMESTAMP',
  })
  deadline!: Date;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.FEATURE,
  })
  type!: TaskType;

  @Column()
  reportedBy!: number;

  @Column()
  completedBy!: number; // this can be null

  @Column()
  assignedTo!: number;

  @Column('timestamp', {
    name: 'createdOn',
    default: (): string => 'LOCALTIMESTAMP',
  })
  createdOn!: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status!: TaskStatus;
}
