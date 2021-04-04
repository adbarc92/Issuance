import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '../../../types/user';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  hashed_password!: string;

  @Column()
  salt!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MIDDLER,
  })
  role!: UserRole;

  @Column('uuid')
  person_id!: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;

  @Column({ nullable: true })
  last_login: Date;
}
