import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  BOSS = 'BOSS',
  MIDDLER = 'MIDDLER',
  GRUNT = 'GRUNT',
}

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
