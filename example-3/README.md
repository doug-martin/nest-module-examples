# Example 3

Now that we have a controller returning basic info lets add a service.

Lets create the controller

```sh
npx nest g service basic
```

This command creates a new `service` in the basic module directory

```
src/
  basic/
    basic.controller.ts
    basic.module.ts
    basic.service.spec.ts
    basic.service.ts
  app.module.ts
```

The command also adds the service to your module. Notice how its listed as a provider, this lets nest know that it is injectable through DI in classes within the current module.

```ts
// basic/basic.module.ts
import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

@Module({
  controllers: [BasicController],
  providers: [BasicService]
})
export class BasicModule {}

```

The generated service is empty by default 

```ts
// basic/basic.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicService {}

```

Lets move the messaging from the controller to the service. 

First lets create a `findAll` method on the service. 

```ts
// basic/basic.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class BasicService {
  findAll(): string[] {
    return ['Find all from service!']
  }
}

```

Now lets inject the service and use it in the controller.

Notice how the service is added as a parameter to the constructor, because it is listed as a provider in the `basic.module` nest will create an instance and inject it when the controller is instantiated.

```ts
// basic/basic.controller.ts

import { Controller, Get } from '@nestjs/common';
import { BasicService } from './basic.service';

@Controller('basic')
export class BasicController {

  constructor(readonly service: BasicService) {
  }

  @Get()
  findAll(): string[] {
    return this.service.findAll();
  }
}
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

In the next example we'll add a reuse the same service to expose both graphql and rest endpoints. [Go To Example 4](../example-4)
