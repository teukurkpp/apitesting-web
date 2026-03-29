import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

import { ApiTarget } from './entities/api-target.entity';
import { ApiLog } from './entities/api-log.entity';

import { ApisModule } from './apis/apis.module';
import { LogsModule } from './logs/logs.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { MonitoringService } from './monitoring/monitoring.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME!,
      password: process.env.DB_PASSWORD!,
      database: process.env.DB_NAME!,
      entities: [ApiTarget, ApiLog],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    ApisModule,
    LogsModule,
    DashboardModule,
  ],
  providers: [],
})
export class AppModule {}
