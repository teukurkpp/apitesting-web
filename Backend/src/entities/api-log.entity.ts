import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiTarget } from './api-target.entity';

@Entity('api_logs')
export class ApiLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  apiId: number;

  @ManyToOne(() => ApiTarget, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'apiId' })
  api: ApiTarget;

  @Column()
  apiName: string;

  @Column()
  statusCode: number;

  @Column()
  responseTime: number;

  @Column({ length: 20 })
  responseSize: string;

  @CreateDateColumn()
  createdAt: Date;
}
