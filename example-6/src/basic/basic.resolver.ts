import { Query, Resolver } from '@nestjs/graphql';
import { BasicService } from './basic.service';

@Resolver('Basic')
export class BasicResolver {
  constructor(readonly service: BasicService) {
  }

  @Query(() => [String])
  findAll(): string[] {
    return this.service.findAll();
  }
}
