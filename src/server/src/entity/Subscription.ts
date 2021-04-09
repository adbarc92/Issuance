import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { UpdateItemTypes } from '../../../types/updateItem';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  subscribed_item_id!: string;

  @Column('uuid')
  subscriber_id!: string;

  @Column()
  subscription_type: UpdateItemTypes;

  @CreateDateColumn()
  created_at: Date;
}
