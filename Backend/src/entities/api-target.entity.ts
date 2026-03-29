import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('api_targets')
export class ApiTarget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column()
  url: string;

  @Column({ length: 10 })
  method: string;

  @Column({ default: 30 })
  interval: number;

  @Column({ default: 'active' })
  status: 'active' | 'inactive';

  @Column({ default: 0, type: 'float' })
  avgResponseTime: number;

  @Column({ default: 100, type: 'float' })
  uptime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
