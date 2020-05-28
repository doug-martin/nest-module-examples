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
