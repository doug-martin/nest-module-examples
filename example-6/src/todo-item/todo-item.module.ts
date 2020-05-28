import { Module } from '@nestjs/common';
import { TodoItemController } from './todo-item.controller';
import { TodoItemResolver } from './todo-item.resolver';
import { TodoItemService } from './todo-item.service';

@Module({
  controllers: [TodoItemController],
  providers: [TodoItemResolver, TodoItemService],
})
export class TodoItemModule {
}
