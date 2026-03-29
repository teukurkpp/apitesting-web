import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ApiLog } from '../entities/api-log.entity';
import { ApiTarget } from '../entities/api-target.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog, ApiTarget])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
