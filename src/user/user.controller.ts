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
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('sign-up')
  @Public()
  async signup(@Body() signUpDto: SignUpUserDto) {
    return this.userService.signUp(signUpDto);
  }

  // User sign-in
  @ApiOkResponse({
    description: 'Profile completed',
    example: {
      success: true,
      message: 'Profile completed successfully',
      data: { accessToken: '', refreshToken: '' },
    },
  })
  @ApiBadRequestResponse({
    description: 'PASSWORD_MISMATCH',
    example: { success: true, message: 'PASSWORD_MISMATCH', data: null },
  })
  @Post('sign-in')
  @Public()
  async signIn(@Body() signInDto: SignInUserDto) {
    return this.userService.signIn(signInDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get('who-am-i')
  getProfile(@Request() req) {
    return this.userService.getUserInfo(req.user.userId);
  }
}
