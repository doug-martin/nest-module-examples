import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TodoItemService } from './todo-item.service';
import { CreateTodoItemDto, TodoItemDto, UpdateTodoItemDto } from './todo-item.dto';

@Controller('todo-item')
export class TodoItemController {
  constructor(readonly service: TodoItemService) {
  }

  @Get()
  findAll(): Promise<TodoItemDto[]> {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseIntPipe) id: number): Promise<TodoItemDto> {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() createTodoItemDto: CreateTodoItemDto) {
    return this.service.create(createTodoItemDto)
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateTodoItemDto: UpdateTodoItemDto) {
    return this.service.update(id, updateTodoItemDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<TodoItemDto> {
    return this.service.delete(id);
  }
}
