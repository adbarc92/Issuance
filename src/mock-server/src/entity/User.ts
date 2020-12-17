import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  // Foreign
  @Column('uuid')
  person_id!: string;
}
