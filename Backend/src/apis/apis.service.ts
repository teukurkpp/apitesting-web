import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTarget } from '../entities/api-target.entity';
import { CreateApiDto } from './dto/create-api.dto';
import { MonitoringService } from '../monitoring/monitoring.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ApisService {
  constructor(
    @InjectRepository(ApiTarget)
    private repo: Repository<ApiTarget>,
    private monitoringService: MonitoringService,
    private httpService: HttpService,
  ) {}

  private async validateApiEndpoint(dto: CreateApiDto): Promise<void> {
    try {
      const testRes = await firstValueFrom(
        this.httpService.request({
          method: dto.method as any,
          url: dto.url,
          timeout: 10000,
          headers: { Accept: 'application/json, */*' },
        }),
      );
      this.checkIsRealApi(testRes);
    } catch (e: any) {
      if (e.response) {
        this.checkIsRealApi(e.response);
        return;
      }
      throw new BadRequestException(
        `API tidak dapat dijangkau: ${e.message}. Pastikan URL benar dan server API online.`,
      );
    }
  }

  private checkIsRealApi(res: any): void {
    const contentType = (res.headers?.['content-type'] || '').toLowerCase();
    if (contentType.includes('text/html')) {
      throw new BadRequestException(
        'Ini bukan endpoint API yang valid. Harus mengembalikan data (JSON/XML), bukan halaman website (HTML).',
      );
    }
  }

  async findAll() {
    return this.repo.find();
  }

  async create(dto: CreateApiDto) {
    await this.validateApiEndpoint(dto);
    const api = this.repo.create({ ...dto, status: dto.status ?? 'active' });
    const saved = await this.repo.save(api);
    if (saved.status === 'active')
      this.monitoringService.startMonitoring(saved);
    return saved;
  }

  async update(id: number, dto: CreateApiDto) {
    await this.validateApiEndpoint(dto);
    const api = await this.repo.findOne({ where: { id } });
    if (!api) throw new Error('API not found');

    const wasActive = api.status === 'active';
    Object.assign(api, dto);
    const saved = await this.repo.save(api);

    if (saved.status === 'active') {
      this.monitoringService.startMonitoring(saved);
    } else if (wasActive) {
      this.monitoringService.stopMonitoring(id);
    }
    return saved;
  }

  async toggle(id: number) {
    const api = await this.repo.findOne({ where: { id } });
    if (!api) throw new Error('API not found');

    api.status = api.status === 'active' ? 'inactive' : 'active';
    const saved = await this.repo.save(api);

    if (saved.status === 'active') {
      this.monitoringService.startMonitoring(saved);
    } else {
      this.monitoringService.stopMonitoring(id);
    }
    return saved;
  }

  async remove(id: number) {
    this.monitoringService.stopMonitoring(id);
    await this.repo.delete(id);
    return { deleted: true };
  }
}
