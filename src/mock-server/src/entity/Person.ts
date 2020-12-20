import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PersonJob } from '../../../types/person';

@Entity()
export class Person {
  @PrimaryGeneratedColumn('uuid')
  id!: string; // one-to-one

  @Column()
  username: string;

  @Column({ nullable: true })
  profile_picture: string;

  @Column({ nullable: true })
  contact_email: string;

  @Column({ nullable: true })
  first_name: string;

  @Column({ nullable: true })
  last_name: string;

  @Column()
  job!: PersonJob;
}
