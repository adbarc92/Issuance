import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PersonJob } from '../../../types/person';

@Entity()
export class PersonEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  user_email: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column()
  job!: PersonJob;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ default: (): boolean => false })
  hidden: boolean;
}
