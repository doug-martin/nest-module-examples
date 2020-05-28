import { Controller, Get } from '@nestjs/common';
import { BasicService } from './basic.service';

@Controller('basic')
export class BasicController {

  constructor(readonly service: BasicService) {
  }

  @Get()
  findAll(): string[] {
    return this.service.findAll();
  }
}
