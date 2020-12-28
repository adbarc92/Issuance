import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ default: (): number => 0 })
  row_index!: number;

  @Column()
  project_id!: number;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column('timestamp', {
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
  reported_by!: number;

  @Column()
  assigned_to!: number;

  @Column('timestamp', {
    default: (): string => 'LOCALTIMESTAMP',
  })
  created_on!: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status!: TaskStatus;
}
