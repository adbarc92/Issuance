import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

import { UserRole } from '../../../types/user';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  login_email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MIDDLER,
  })
  role!: UserRole;
}
