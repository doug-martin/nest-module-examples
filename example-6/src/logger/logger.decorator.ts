import { Inject, Type } from '@nestjs/common';

export const getLoggerToken = (cls: Type<unknown>):string => `${cls.name}Logger`;

export const InjectLogger = (cls: Type<unknown>): ParameterDecorator =>
  Inject(getLoggerToken(cls));
