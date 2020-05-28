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

```ts
import { Inject, Type } from '@nestjs/common';

export const getLoggerToken = (cls: Type<unknown>):string => `${cls.name}Logger`;

export const InjectLogger = (cls: Type<unknown>): ParameterDecorator =>
  Inject(getLoggerToken(cls));

```

This decorator will allow us to inject the logger so we can replace the implementation later on without having to change our class.We'll see its usage in a bit. 

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
