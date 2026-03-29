import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogsController } from './logs.controller';
import { LogsService } from './logs.service';
import { ApiLog } from '../entities/api-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ApiLog])],
  controllers: [LogsController],
  providers: [LogsService],
})
export class LogsModule {}
