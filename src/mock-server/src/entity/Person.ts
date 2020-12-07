import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PersonRole } from '../../../types/person';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id!: number; // one-to-one

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  role!: PersonRole;
}
