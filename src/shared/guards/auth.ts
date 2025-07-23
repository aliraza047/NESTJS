import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ResponseUtil } from '../utility/response';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const user = request['user'];

      if (!user) {
        ResponseUtil.error('Unauthorized', HttpStatus.UNAUTHORIZED);
        return false;
      }
    } catch (error) {
      throw error;
    }
    return true;
  }
}
