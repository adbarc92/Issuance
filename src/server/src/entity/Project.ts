import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column('timestamp', {
    default: (): string => 'LOCALTIMESTAMP',
  })
  deadline!: Date;
}
