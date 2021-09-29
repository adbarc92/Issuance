import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class NotificationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: (): boolean => false })
  viewed: boolean;

  @Column('uuid')
  user_id: string;

  @Column('uuid')
  update_item_id: string;

  @CreateDateColumn()
  created_at!: Date;

  @Column('uuid')
  subscription_id!: string;
}
