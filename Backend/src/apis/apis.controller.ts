import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Body,
} from '@nestjs/common';
import { ApisService } from './apis.service';
import { CreateApiDto } from './dto/create-api.dto';

@Controller('apis')
export class ApisController {
  constructor(private service: ApisService) {}

  @Get() findAll() {
    return this.service.findAll();
  }
  @Post() create(@Body() dto: CreateApiDto) {
    return this.service.create(dto);
  }
  @Put(':id') update(@Param('id') id: string, @Body() dto: CreateApiDto) {
    return this.service.update(+id, dto);
  }
  @Patch(':id/toggle') toggle(@Param('id') id: string) {
    return this.service.toggle(+id);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.service.remove(+id);
  }
}
