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
