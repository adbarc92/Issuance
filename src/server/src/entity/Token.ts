import {
  Column,
  Entity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TokenEntity {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamp', {
    default: (): string => 'LOCALTIMESTAMP',
  })
  created_on!: string;

  @Column() // Todo: Should be UUID
  user_id!: string;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
