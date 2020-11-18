import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from 'entity/User';

@Entity()
export class Personnel {
  @PrimaryGeneratedColumn()
  id!: number; // one-to-one

  @Column()
  avatar: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  role!: UserRole;

  @Column()
  project!: number;
}
