import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PersonRole } from '../../../types/person';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // one-to-one

  @Column({ nullable: true })
  profilePicture: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  role!: PersonRole;
}
