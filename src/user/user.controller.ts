import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SignUpUserDto } from './dto/sign-up.dto';
import { SignInUserDto } from './dto/sign-in.dto';
import { Public } from '../shared/decorator/public.docorator';
import { AuthenticationGuard } from 'src/shared/guards/auth';

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

  @UseGuards(AuthenticationGuard)
  @Get('who-am-i')
  getProfile(@Request() req) {
    return req.user;
  }
}
