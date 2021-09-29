import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { UpdateItemTypes } from '../../../types/updateItem';

@Entity()
export class SubscriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  subscribed_item_id!: string;

  @Column('uuid')
  subscriber_id!: string;

  @Column()
  subscribed_item_type: UpdateItemTypes;

  @CreateDateColumn()
  created_at: Date;
}
