import { Controller, Get, Query } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get()
  findAll(
    @Query('filter') filter: string = 'all',
    @Query('range') range: string = 'today',
  ) {
    return this.service.findAll(filter as any, range as any);
  }
}
