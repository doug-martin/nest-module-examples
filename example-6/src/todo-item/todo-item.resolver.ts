import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { CreateTodoItemDto, TodoItemDto, UpdateTodoItemDto } from './todo-item.dto';
import { TodoItemService } from './todo-item.service';

@Resolver(TodoItemDto)
export class TodoItemResolver {
  constructor(readonly todoItemService: TodoItemService) {
  }

  @Query(() => [TodoItemDto])
  todoItems(): Promise<TodoItemDto[]> {
    return this.todoItemService.findAll();
  }

  @Query(() => TodoItemDto)
  todoItem(@Args('id') id: number): Promise<TodoItemDto> {
    return this.todoItemService.findById(id);
  }

  @Mutation(() => TodoItemDto)
  createTodoItem(@Args('input') input: CreateTodoItemDto): Promise<TodoItemDto> {
    return this.todoItemService.create(input);
  }

  @Mutation(() => TodoItemDto)
  updateTodoItem(
    @Args('id', { type: () => Int }) id: number,
    @Args('update') update: UpdateTodoItemDto,
  ): Promise<TodoItemDto> {
    return this.todoItemService.update(id, update);
  }

  @Mutation(() => TodoItemDto)
  deleteTodoItem(@Args('id', { type: () => Int }) id: number): Promise<TodoItemDto> {
    return this.todoItemService.delete(id);
  }
}
