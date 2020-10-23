import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class ProjectPersonnel {
  @PrimaryGeneratedColumn()
  id!:number;

  @Column()
  personnelId!: number;

  @Column()
  projectId!:number;
}
