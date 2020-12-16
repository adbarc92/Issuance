import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { UserRole } from '../../../types/user';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  login_email!: string;

  @Column()
  user_password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MIDDLER,
  })
  user_role!: UserRole;
}
