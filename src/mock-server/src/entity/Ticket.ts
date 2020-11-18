import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum TicketPriority {
  HIGHEST = 'highest',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  LOWEST = 'lowest',
}

export enum TicketType {
  FEATURE = 'feature',
  BUG = 'bug',
  EPIC = 'epic',
}

export enum TicketStatus {
  BACKLOG = 'backlog',
  ACTIVE = 'active',
  COMPLETE = 'complete',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name!: string;

  @Column()
  project!: number;

  @Column()
  summary!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority!: TicketPriority;

  @Column('timestamp', {
    // name: 'deadline',
    default: (): string => 'LOCALTIMESTAMP',
  })
  deadline!: Date;

  @Column({
    type: 'enum',
    enum: TicketType,
    default: TicketType.FEATURE,
  })
  type!: TicketType;

  @Column()
  reportedBy!: number;

  @Column()
  completedBy!: number;

  @Column()
  assignedTo!: number;

  @Column('timestamp', {
    name: 'createdOn',
    default: (): string => 'LOCALTIMESTAMP',
  })
  createdOn!: Date;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.BACKLOG,
  })
  status!: TicketStatus;
}
