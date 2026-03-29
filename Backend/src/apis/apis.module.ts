import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ApisController } from './apis.controller';
import { ApisService } from './apis.service';
import { ApiTarget } from '../entities/api-target.entity';
import { ApiLog } from '../entities/api-log.entity';
import { MonitoringService } from '../monitoring/monitoring.service';

@Module({
  imports: [TypeOrmModule.forFeature([ApiTarget, ApiLog]), HttpModule],
  controllers: [ApisController],
  providers: [ApisService, MonitoringService],
  exports: [ApisService, MonitoringService],
})
export class ApisModule {}
