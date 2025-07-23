import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy } from 'src/shared/strategies/auth';
import { UserHelper } from './helpers';

@Module({
  controllers: [UserController],
  providers: [UserService, AtStrategy, UserHelper],
  imports: [JwtModule.register({})],
})
export class UserModule {}
