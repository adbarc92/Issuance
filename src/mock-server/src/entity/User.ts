import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { UserRole } from '../types/user';

export enum UserRole {
  BOSS = 'boss',
  MIDDLER = 'middler',
  GRUNT = 'grunt',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.MIDDLER,
  })
  role!: UserRole;
}
