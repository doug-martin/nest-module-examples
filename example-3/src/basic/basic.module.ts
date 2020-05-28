import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';

@Module({
  controllers: [BasicController],
})
export class BasicModule {}

