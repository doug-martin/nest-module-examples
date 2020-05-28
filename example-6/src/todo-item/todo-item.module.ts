import { Module } from '@nestjs/common';
import { TodoItemController } from './todo-item.controller';
import { TodoItemResolver } from './todo-item.resolver';
import { TodoItemService } from './todo-item.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [TodoItemController],
  providers: [TodoItemResolver, TodoItemService,
    {
      provide: 'CONSTANT',
      useValue: 'my_constant',
    }],
  imports: [
    LoggerModule.forFeature([TodoItemService]),
  ],
})
export class TodoItemModule {
}
