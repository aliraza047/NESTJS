import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ResponseUtil } from '../utility/response';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let request: any;

    if (context.getType<'graphql'>() === 'graphql') {
      // GraphQL → extract req from GQL context
      const ctx = GqlExecutionContext.create(context);
      request = ctx.getContext().req;
    } else {
      // REST → extract req from HTTP context
      request = context.switchToHttp().getRequest();
    }

    try {
      const user = request?.user;

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
