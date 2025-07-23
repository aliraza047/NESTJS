// shared/guards/auth.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorator/public.docorator';
import { ResponseUtil } from '../utility/response';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) {
      ResponseUtil.error('Unauthorized', HttpStatus.UNAUTHORIZED);
      return false;
    }
    return true;
  }
}
