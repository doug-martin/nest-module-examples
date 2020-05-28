import { Module } from '@nestjs/common';
import { BasicModule } from './basic/basic.module';

@Module({
  imports: [BasicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
