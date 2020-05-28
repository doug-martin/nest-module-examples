# Example 6

In Example 5 we created a basic crud app, lets add some logging so we know whats going on and explore dynamic modules at the same time. 

Run the following generator commands 

```sh
npx nest g module logger
npx nest g decorator logger logger
npx nest g class logger logger
npx nest g class nest-native.logger logger
```

Lets define our `Logger` interface. This will be the base for any logger implementations.

```ts
// logger.ts
import { Injectable } from '@nestjs/common';

export interface Logger {
  name: string;
  error(msg: string, ...extra: any): void
  warn(msg: string, ...extra: any): void
  info(msg: string, ...extra: any): void
  debug(msg: string, ...extra: any): void
}
```

Next we can create an implementation the `Logger` interface with a logger that wraps the built in nest one.

```ts
import { Logger } from './logger';
import { Logger as NestLogger } from '@nestjs/common';

export class NestNativeLogger implements Logger {
  readonly nestLogger: NestLogger;
  constructor(readonly name: string) {
    this.nestLogger = new NestLogger(name)
  }

  debug(msg: string, ...extra: any[]): void {
    return this.nestLogger.debug(`[DEBUG] - ${msg}`, ...extra)
  }

  error(msg: string, ...extra: any[]): void {
    return this.nestLogger.error(`[ERROR] - ${msg}`, ...extra)
  }

  info(msg: string, ...extra: any[]): void {
    return this.nestLogger.log(`[INFO] - ${msg}`, ...extra)
  }

  warn(msg: string, ...extra: any[]): void {
    return this.nestLogger.warn(`[WARN] - ${msg}`, ...extra)
  }
}

```

Now how can we use the logger using DI? A Decorator! 

Below we expose a ParameterDecorator that accepts a class. We use the name of the class to generate a `token` that will be used by the `LoggerModule` to create a provider.

```ts
import { Inject, Type } from '@nestjs/common';

export const getLoggerToken = (cls: Type<unknown>):string => `${cls.name}Logger`;

export const InjectLogger = (cls: Type<unknown>): ParameterDecorator =>
  Inject(getLoggerToken(cls));

```

Finally we can define our dynamic module. 

```
import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { getLoggerToken } from './logger.decorator';
import { NestNativeLogger } from './nest-native.logger';

export class LoggerModule {
  static forFeature(types: Type<unknown>[]): DynamicModule{
    const providers = types.map(type => this.createLoggerProvider(type))
    return {
      module: LoggerModule,
      providers: [...providers],
      exports: [...providers]
    }
  }

  private static createLoggerProvider(type: Type<unknown>): Provider {
    return {
      provide: getLoggerToken(type),
      useValue: new NestNativeLogger(type.name),
    }
  }
}
```

Lets take a look at the `createLoggerProvider` method. 

```ts
private static createLoggerProvider(type: Type<unknown>): Provider {
  return {
    provide: getLoggerToken(type),
    useValue: new NestNativeLogger(type.name),
  }
}
```

Notice how we set the `provide` field to the value of `getLoggerToken(type)` this is the same token used in the decorator, the token is used internally by nest to look up the correct provider. When the `@InjectLogger` decorator is used a `NestNativeLogger` will be used. 

Finally lets update our todo item module to use the new logger.

```ts
// todo-item/todo-item.module.ts
import { Module } from '@nestjs/common';
import { TodoItemController } from './todo-item.controller';
import { TodoItemResolver } from './todo-item.resolver';
import { TodoItemService } from './todo-item.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  controllers: [TodoItemController],
  providers: [TodoItemResolver, TodoItemService],
  imports: [
    // import the logger module and pass in the classes we want to create loggers for. 
    LoggerModule.forFeature([TodoItemService]),
  ],
})
export class TodoItemModule {
}

```

Update the service to use the decorator and add some logging. 

```ts
// todo-item/todo-item.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoItemDto, TodoItemDto, UpdateTodoItemDto } from './todo-item.dto';
import { InjectLogger } from '../logger/logger.decorator';
import { Logger } from '../logger/logger';

@Injectable()
export class TodoItemService {

  private todoItems: TodoItemDto[];

  private latestId: number;

  constructor(@InjectLogger(TodoItemService) readonly logger: Logger) {
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
    this.logger.info('Find All')
    return Promise.resolve(this.todoItems);
  }

  findById(id: number): Promise<TodoItemDto | undefined> {
    this.logger.info(`Find by id ${id}`);
    return Promise.resolve(this.todoItems.find(ti => ti.id === id));
  }

  create(createTodoItem: CreateTodoItemDto): Promise<TodoItemDto> {
    this.logger.info(`Create ${JSON.stringify(createTodoItem)}`);
    const todoItem: TodoItemDto = {id: ++this.latestId, ...createTodoItem};
    this.todoItems.push(todoItem);
    return Promise.resolve(todoItem);
  }

  async update(id: number, updateTodoItem: UpdateTodoItemDto): Promise<TodoItemDto> {
    this.logger.info(`Update ${id} ${JSON.stringify(updateTodoItem)}`);
    const todoItem: TodoItemDto = await this.findById(id);
    if(!todoItem){
      this.logger.warn(`unable to find todoitem with id ${id}`)
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
    this.logger.info(`Delete ${id}`);
    const todoItem: TodoItemDto = await this.findById(id);
    if(!todoItem){
      this.logger.warn(`unable to find todoitem with id ${id}`)
      throw new NotFoundException("Unable to find todoitem");
    }
    this.todoItems = this.todoItems.filter(ti => ti !== todoItem)
    return todoItem;
  }
}
```

You can now run the example

```sh
npm run start:dev
```

When you hit your graphql or rest end points you should see logging from your service!
