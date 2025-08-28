import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => Float)
  @IsNumber()
  price: number;

  @Field()
  @IsNotEmpty()
  userId: string;
}
