import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { BasicResolver } from './basic.resolver';

@Module({
  controllers: [BasicController],
  providers: [BasicService, BasicResolver]
})
export class BasicModule {}
