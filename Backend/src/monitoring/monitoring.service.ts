import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ApiTarget } from '../entities/api-target.entity';
import { ApiLog } from '../entities/api-log.entity';

@Injectable()
export class MonitoringService implements OnModuleInit {
  private timers = new Map<number, NodeJS.Timeout>();

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(ApiTarget)
    private apiRepo: Repository<ApiTarget>,
    @InjectRepository(ApiLog)
    private logRepo: Repository<ApiLog>,
  ) {}

  async onModuleInit() {
    const active = await this.apiRepo.find({ where: { status: 'active' } });
    active.forEach((api) => this.startMonitoring(api));
    console.log(`Monitoring ${active.length} API aktif dimulai`);
  }

  startMonitoring(api: ApiTarget) {
    this.stopMonitoring(api.id);
    const timer = setInterval(() => this.ping(api.id), api.interval * 1000);
    this.timers.set(api.id, timer);
  }

  stopMonitoring(id: number) {
    const timer = this.timers.get(id);
    if (timer) {
      clearInterval(timer);
      this.timers.delete(id);
    }
  }

  private async ping(id: number) {
    const api = await this.apiRepo.findOne({ where: { id } });
    if (!api || api.status !== 'active') return;

    const start = Date.now();
    let statusCode = 0;
    let responseTime = 0;
    let responseSize = '0.0 KB';

    try {
      const res = await firstValueFrom(
        this.httpService.request({
          method: api.method as any,
          url: api.url,
          timeout: 15000,
        }),
      );
      statusCode = res.status;
      responseTime = Date.now() - start;
      const bytes = parseInt(res.headers['content-length'] || '0');
      responseSize = `${(bytes / 1024).toFixed(1)} KB`;
    } catch (e: any) {
      statusCode = e.response?.status || 503;
      responseTime = Date.now() - start;
    }

    const log = this.logRepo.create({
      apiId: api.id,
      apiName: api.name,
      statusCode,
      responseTime,
      responseSize,
    });
    await this.logRepo.save(log);

    await this.updateApiStats(api.id);
  }

  private async updateApiStats(apiId: number) {
    const logs = await this.logRepo.find({
      where: { apiId },
      order: { createdAt: 'DESC' },
      take: 100,
    });

    if (logs.length === 0) return;

    const avg = Math.round(
      logs.reduce((a, b) => a + b.responseTime, 0) / logs.length,
    );
    const success = logs.filter(
      (l) => l.statusCode >= 200 && l.statusCode < 300,
    ).length;
    const uptime = Math.round((success / logs.length) * 100 * 10) / 10;

    await this.apiRepo.update(apiId, { avgResponseTime: avg, uptime });
  }
}
