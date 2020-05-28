# Example 5

Lets create a `todo-item` app using the basic we learned in the previous examples.



```sh
npx nest g module todo-item
npx nest g class todo-item.dto todo-item
npx nest g service todo-item
npx nest g controller todo-item
npx nest g resolver todo-item
```

The above commands should create the following files.

```
src/
  todo-item/
    todo-item.controller.ts
    todo-item.dto.ts
    todo-item.module.ts
    todo-item.service.ts
  app.module.ts
```

First lets fill out the `todo-item.dto.ts`. This file will export three classes

1. `TodoItemDto` - The DTO that is returned from queries.
2. `CreateTodoItemDto` - The DTO used to create todo-items
3. `UpdateTodoItemDto` - The DTO used to update todo-items

**NOTE** The graphql decorators will be used by the resolver, but the class can still be used in rest controllers as well.

```ts
// todo-item/todo-item.dto.ts
import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";

@ObjectType('TodoItem')
export class TodoItemDto {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  completed: boolean;
}

// The OmitType includes all fields except the 'id'
@InputType('CreateTodoItemInput')
export class CreateTodoItemDto extends OmitType(TodoItemDto, ['id'], InputType) {}

// The PartialType makes all fields optional.
@InputType('UpdateTodoItemInput')
export class UpdateTodoItemDto extends PartialType(CreateTodoItemDto, InputType) {}

```

Now, we can fill out the `todo-item.service.ts`. This example uses an in memory array of `TodoItemDtos`, but this service could also come from `typeorm`. 

```ts
// todo-item/todo-item.service.ts
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


```

Now that we have a service lets update our controller to expose CRUD methods using the service.

```ts
// todo-item/todo-item.controller.ts
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

```

The resolver will be very similar to the controller, In fact the only real difference is the decorators from `@nestjs/graphql`.

```ts
// basic/basic.resolver.ts
import { Query, Resolver, Args, Mutation, Int } from '@nestjs/graphql';
import { CreateTodoItemDto, TodoItemDto, UpdateTodoItemDto } from './todo-item.dto';
import { TodoItemService } from './todo-item.service';

@Resolver(() => TodoItemDto)
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

```

The last thing is to enable `graphql` in the `app.module`.

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { BasicModule } from './basic/basic.module';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    BasicModule,
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql'
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

Now lets test it out!

```sh
npm run start:dev
```

Now goto http://localhost:3000/todo-item

You should see 
```
[{"id":1,"title":"Todo Item 1","completed":true},{"id":2,"title":"Todo Item 2","completed":true},{"id":3,"title":"Todo Item 3","completed":true},{"id":4,"title":"Todo Item 4","completed":true},{"id":5,"title":"Todo Item 5","completed":true}]
```

You can also visit http://localhost:3000/graphql

```graphql
{
  todoItems {
    id
    title
    completed
  }
}
```

Should resolve with

```json
{
  "data": {
    "todoItems": [
      {
        "id": 1,
        "title": "Todo Item 1",
        "completed": true
      },
      {
        "id": 2,
        "title": "Todo Item 2",
        "completed": true
      },
      {
        "id": 3,
        "title": "Todo Item 3",
        "completed": true
      },
      {
        "id": 4,
        "title": "Todo Item 4",
        "completed": true
      },
      {
        "id": 5,
        "title": "Todo Item 5",
        "completed": true
      }
    ]
  }
}
```

You can test out the other methods using postman and the playground.

In the next example we'll create a dynamic module to add logging. [Go To Example 6](../example-6)
