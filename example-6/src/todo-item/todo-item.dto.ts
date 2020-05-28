import { Field, InputType, Int, ObjectType, OmitType, PartialType } from "@nestjs/graphql";

@ObjectType('TodoItem')
export class TodoItemDto {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  completed: boolean;
}

@InputType('CreateTodoItemInput')
export class CreateTodoItemDto extends OmitType(TodoItemDto, ['id'], InputType) {}

@InputType('UpdateTodoItemInput')
export class UpdateTodoItemDto extends PartialType(CreateTodoItemDto, InputType) {}
