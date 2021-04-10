import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { TaskPriority, TaskType, TaskStatus } from '../../../types/task';
@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TaskType,
    default: TaskType.FEATURE,
  })
  type!: TaskType;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.MEDIUM,
  })
  priority!: TaskPriority;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.BACKLOG,
  })
  status!: TaskStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column('uuid', { nullable: true })
  assigned_to!: string;

  @Column({ default: (): number => 0 })
  row_index!: number;

  @Column('timestamp', {
    default: (): string => 'LOCALTIMESTAMP',
  })
  deadline!: Date;

  @Column('uuid')
  project_id!: string;

  @Column('uuid', { nullable: true })
  reported_by!: string;

  @Column()
  story_points: number;

  @Column({ default: (): boolean => false })
  hidden: boolean;
}
