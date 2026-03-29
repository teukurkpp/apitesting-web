import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { ApiLog } from '../entities/api-log.entity';
import { ApiTarget } from '../entities/api-target.entity';

export interface ResponseTimePoint {
  time: string;
  [key: string]: string | number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ApiLog)
    private logRepo: Repository<ApiLog>,

    @InjectRepository(ApiTarget)
    private apiRepo: Repository<ApiTarget>,
  ) {}

  async getSummary() {
    const activeApis = await this.apiRepo.find({
      where: { status: 'active' },
    });

    const totalActive = activeApis.length;

    let totalRt = 0;
    let totalUptime = 0;
    activeApis.forEach((a) => {
      totalRt += a.avgResponseTime;
      totalUptime += a.uptime;
    });

    const avgResponseTime = totalActive ? Math.round(totalRt / totalActive) : 0;
    const uptime = totalActive
      ? Math.round((totalUptime / totalActive) * 10) / 10
      : 0;

    const totalRequests = await this.logRepo.count();

    const errorCount = await this.logRepo.count({
      where: { statusCode: MoreThanOrEqual(400) },
    });

    const errorRate = totalRequests ? (errorCount / totalRequests) * 100 : 0;

    return {
      avgResponseTime,
      totalRequests,
      errorRate: errorRate.toFixed(1) + '%',
      uptime,
    };
  }

  async getResponseTimeData() {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const logs = await this.logRepo.find({
      where: { createdAt: MoreThanOrEqual(oneHourAgo) },
      order: { createdAt: 'ASC' },
      relations: ['api'],
    });

    if (logs.length === 0) {
      return [];
    }

    const timeMap = new Map<string, { [key: string]: number[] }>();

    logs.forEach((log) => {
      const timeKey = log.createdAt.toISOString().slice(0, 16);
      const apiKey = log.api.name.toLowerCase().replace(/\s/g, '');
      if (!timeMap.has(timeKey)) timeMap.set(timeKey, {});
      if (!timeMap.get(timeKey)![apiKey]) timeMap.get(timeKey)![apiKey] = [];
      timeMap.get(timeKey)![apiKey].push(log.responseTime);
    });

    const data: ResponseTimePoint[] = [];
    timeMap.forEach((apiData, time) => {
      const point: ResponseTimePoint = { time };
      Object.keys(apiData).forEach((key) => {
        const rtList = apiData[key];
        point[key] = Math.round(
          rtList.reduce((a, b) => a + b, 0) / rtList.length,
        );
      });
      data.push(point);
    });

    return data.sort((a, b) => a.time.localeCompare(b.time));
  }

  async getStatusDistribution() {
    const total = await this.logRepo.count();

    if (total === 0) {
      return [];
    }

    const success = await this.logRepo.count({
      where: { statusCode: Between(200, 299) },
    });

    const clientErr = await this.logRepo.count({
      where: { statusCode: Between(400, 499) },
    });

    const serverErr = await this.logRepo.count({
      where: { statusCode: MoreThanOrEqual(500) },
    });

    const s = Math.round((success / total) * 100);
    const c = Math.round((clientErr / total) * 100);
    const sv = Math.round((serverErr / total) * 100);

    const totalPercent = s + c + sv;
    const adjustedSv = sv + (100 - totalPercent);

    return [
      { name: '200 OK', value: s, color: '#10b981' },
      { name: '4xx Error', value: c, color: '#f59e0b' },
      { name: '5xx Error', value: adjustedSv, color: '#ef4444' },
    ];
  }
}
