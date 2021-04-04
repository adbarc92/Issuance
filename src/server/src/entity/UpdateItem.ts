import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UpdateItemTypes {
  COMMENT = 'Comment',
  PROJECT = 'Project',
  TASK = 'Task',
}

export enum UpdateItemActions {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

@Entity()
export class UpdateItem {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  created_at: Date;

  @Column()
  item_type: UpdateItemTypes;

  @Column('uuid')
  item_id: string;

  @Column()
  action_type: UpdateItemActions;
}
