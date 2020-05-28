import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto, TodoItemDto, UpdateTodoItemDto } from './todo-item.dto';

@Injectable()
export class TodoItemService {

  private todoItems: TodoItemDto[];

  private latestId: number;

  constructor() {
    this.todoItems = [
      { id: 1, title: 'Todo Item 1', completed: true },
      { id: 2, title: 'Todo Item 2', completed: true },
      { id: 3, title: 'Todo Item 3', completed: true },
      { id: 4, title: 'Todo Item 4', completed: true },
      { id: 5, title: 'Todo Item 5', completed: true },
    ];
    this.latestId = this.todoItems[this.todoItems.length - 1].id;
  }

  findAll(): Promise<TodoItemDto[]> {
    return Promise.resolve(this.todoItems);
  }

  findById(id: number): Promise<TodoItemDto | undefined> {
    return Promise.resolve(this.todoItems.find(ti => ti.id === id));
  }

  create(createTodoItem: CreateTodoItemDto): Promise<TodoItemDto> {
    const todoItem: TodoItemDto = {id: ++this.latestId, ...createTodoItem};
    this.todoItems.push(todoItem);
    return Promise.resolve(todoItem);
  }

  async update(id: number, updateTodoItem: UpdateTodoItemDto): Promise<TodoItemDto> {
    const todoItem: TodoItemDto = await this.findById(id);
    if(!todoItem){
      throw new NotFoundException("Unable to find todoitem");
    }
    if(updateTodoItem.title !== undefined){
      todoItem.title = updateTodoItem.title
    }
    if(updateTodoItem.completed !== undefined){
      todoItem.completed = updateTodoItem.completed
    }
    return todoItem;
  }

  async delete(id: number): Promise<TodoItemDto> {
    const todoItem: TodoItemDto = await this.findById(id);
    if(!todoItem){
      throw new NotFoundException("Unable to find todoitem");
    }
    this.todoItems = this.todoItems.filter(ti => ti !== todoItem)
    return todoItem;
  }
}
