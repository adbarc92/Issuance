import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { UpdateItemTypes, UpdateItemActions } from '../../../types/updateItem';

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

  @Column('uuid')
  user_id: string; // * The User who made the change
}
