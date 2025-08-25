import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EventModel {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field()
  orgId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
