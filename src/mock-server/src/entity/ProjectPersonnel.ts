import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProjectPersonnel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  personnelId!: number;

  @Column()
  projectId!: number;
}
