import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/sign-up.dto';
import { SignInUserDto } from './dto/sign-in.dto';
import { Public } from '../shared/decorator/public.docorator';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @Public()
  async signup(@Body() signUpDto: SignUpUserDto) {
    return this.userService.signUp(signUpDto);
  }

  @Post('sign-in')
  @Public()
  async signIn(@Body() signInDto: SignInUserDto) {
    return this.userService.signIn(signInDto);
  }
}
