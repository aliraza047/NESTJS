import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SignInUserDto {
  @IsEmail()
  @IsNotEmpty()
  @IsEmail(
    { allow_display_name: true, allow_ip_domain: true },
    { message: 'Invalid email format' },
  )
  @ApiProperty({ example: 'aliraza@gmail.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @ApiProperty({ example: 'Ali@123' })
  password: string;
}
