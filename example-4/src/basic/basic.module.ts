import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

@Module({
  controllers: [BasicController],
  providers: [BasicService]
})
export class BasicModule {}
