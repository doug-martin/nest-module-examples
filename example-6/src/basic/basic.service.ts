import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicService {
  findAll() {
    return ['Find all from service!'];
  }
}
