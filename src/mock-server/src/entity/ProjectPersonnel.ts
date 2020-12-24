import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectPersonnel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  personnel_id!: number;

  @Column()
  project_id!: number;
}
