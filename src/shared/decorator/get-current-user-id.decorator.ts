import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    let request: any;

    if (ctx.getType<'graphql'>() === 'graphql') {
      // GraphQL → get request from context
      const gqlCtx = GqlExecutionContext.create(ctx);
      request = gqlCtx.getContext().req;
    } else {
      // REST → normal HTTP request
      request = ctx.switchToHttp().getRequest();
    }

    const user = request?.user;
    return data ? user?.[data] : user;
  },
);
