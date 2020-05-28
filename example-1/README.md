# Example 1

In this example we set up a basic module without any logic.

The first step is to create a module.

```sh
npx nest g module basic
```

This command creates a new folder in the `src` directory named `basic`

```
src/
  basic/
    basic.module.ts
  app.module.ts
```

With the following module.

```ts
// basic/basic.module.ts
import { Module } from '@nestjs/common';

@Module({})
export class BasicModule {}
```

It also adds the `BasicModule` to the `app.module.ts`

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { BasicModule } from './basic/basic.module';

@Module({
  imports: [BasicModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

```




