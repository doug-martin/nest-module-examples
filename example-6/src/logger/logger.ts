import { Injectable } from '@nestjs/common';

export interface Logger {
  name: string;
  error(msg: string, ...extra: any[]): void
  warn(msg: string, ...extra: any[]): void
  info(msg: string, ...extra: any[]): void
  debug(msg: string, ...extra: any[]): void
}
