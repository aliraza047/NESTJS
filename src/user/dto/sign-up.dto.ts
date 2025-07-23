import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpUserDto {
  @IsEmail() email: string;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
