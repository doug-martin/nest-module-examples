import { Controller, Get } from '@nestjs/common';

@Controller('basic')
export class BasicController {
  @Get()
  findAll(): string {
    return 'A Basic Controller';
  }
}
