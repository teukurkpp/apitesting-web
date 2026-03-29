import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiLog } from '../entities/api-log.entity';

type FilterType = 'all' | 'success' | 'error';
type RangeType = 'today' | '7d' | '30d';

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(ApiLog)
    private logRepo: Repository<ApiLog>,
  ) {}

  async findAll(filter: FilterType = 'all', range: RangeType = 'today') {
    const qb = this.logRepo
      .createQueryBuilder('log')
      .orderBy('log.createdAt', 'DESC')
      .take(200);

    const now = new Date();
    let since = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (range === '7d')
      since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    if (range === '30d')
      since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    if (range === 'today')
      since = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    qb.andWhere('log.createdAt >= :since', { since });

    if (filter === 'success')
      qb.andWhere('log.statusCode >= 200 AND log.statusCode < 300');
    if (filter === 'error') qb.andWhere('log.statusCode >= 400');

    return qb.getMany();
  }
}
