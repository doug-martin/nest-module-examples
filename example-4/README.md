# Example 4

Now that we have a service to return common data lets add a resolver that will expose graphql alongside our rest endpoints.

```sh
npx nest g resolver basic
```

This command creates a new `resolver` in the basic module directory

```
src/
  basic/
    basic.controller.ts
    basic.module.ts
    basic.service.ts
    basic.resolver.spec.ts
    basic.resolver.ts
  app.module.ts
```

The command also adds the resolver to your module. 

```ts
// basic/basic.module.ts
import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';
import { BasicResolver } from './basic.resolver';

@Module({
  controllers: [BasicController],
  providers: [BasicService, BasicResolver]
})
export class BasicModule {}

```

The generated resolver is empty by default 

```ts
// basic/basic.resolver.ts
import { Resolver } from '@nestjs/graphql';

@Resolver('Basic')
export class BasicResolver {}

```

First lets create a `basics` query graphql endpoint. 

The resolver will be very similar to the controller, In fact the only real difference is the decorators from `@nestjs/graphql`.

```ts
// basic/basic.resolver.ts
import { Query, Resolver } from '@nestjs/graphql';
import { BasicService } from './basic.service';

@Resolver('Basic')
export class BasicResolver {
  constructor(readonly service: BasicService) {
  }

  @Query(() => [String])
  basics(): string[] {
    return this.service.findAll();
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

Now goto http://localhost:3000/basic

You should see 
```
["Find all from service!"]
```

You can also visit http://localhost:3000/graphql

```graphql
{
  basics
}
```

Should resolve with

```json
{
  "data": {
    "basics": [
      "Find all from service!"
    ]
  }
}
```


In the next example we'll use all the concepts learned to create a simple todo-item module. [Go To Example 5](../example-5)






