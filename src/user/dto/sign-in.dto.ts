import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInUserDto {
  @IsEmail() email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
