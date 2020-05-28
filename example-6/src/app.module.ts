import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TodoItemModule } from './todo-item/todo-item.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    }),
    TodoItemModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
