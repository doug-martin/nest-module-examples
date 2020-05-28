import { Module } from '@nestjs/common';
import { BasicModule } from './basic/basic.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [BasicModule],
  controllers: [],
  providers: [],
})
export class AppModule {
}
