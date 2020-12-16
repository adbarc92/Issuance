import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp', {
    // name: 'deadline',
    default: (): string => 'LOCALTIMESTAMP',
  })
  createdOn!: string;

  @Column()
  userId!: string;
}
