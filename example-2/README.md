# Example 2

In this example we build on the last example by adding a controller to out basic module.

Lets create the controller

```sh
npx nest g controller basic
```

This command creates a new `controller` in the basic module directory

```
src/
  basic/
    basic.controller.spec.ts
    basic.controller.ts
    basic.module.ts
  app.module.ts
```

The command also adds the controller to your module.

```ts
// basic/basic.module.ts
import { Module } from '@nestjs/common';
import { BasicController } from './basic.controller';

@Module({
  controllers: [BasicController]
})
export class BasicModule {}
```

The generated controller is empty by default 

```ts
//basic/basic.controller.ts
import { Controller } from '@nestjs/common';

@Controller('basic')
export class BasicController {}
```

Lets add a basic route.

```ts
// basic/basic.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('basic')
export class BasicController {
  @Get()
  findAll(): string {
    return 'A Basic Controller';
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
A Basic Controller
```

In the next example we'll add a service to handle fetching data. [Go To Example 3](../example-3)




