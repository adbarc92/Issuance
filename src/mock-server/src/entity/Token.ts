import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp', {
    // name: 'deadline',
    default: (): string => 'LOCALTIMESTAMP',
  })
  created_on!: string;

  @Column()
  user_id!: string;
}
