import { IsString, IsNotEmpty } from 'class-validator';

export class CreateOrganizationDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() country: string;
  @IsString() @IsNotEmpty() currency: string;
  @IsString() @IsNotEmpty() userId: string;
}
