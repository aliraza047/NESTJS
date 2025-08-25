import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ResponseUtil } from './response';

@Catch(HttpException)
export class HttpExceptionFilter
  implements ExceptionFilter, GqlExceptionFilter
{
  catch(exception: HttpException, host: ArgumentsHost) {
    // Check if the request is GraphQL or REST
    const gqlHost = GqlArgumentsHost.create(host);
    if (gqlHost.getType<'graphql'>() === 'graphql') {
      // For GraphQL: return error object for GraphQL error handling
      const response = exception.getResponse();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception.getResponse() instanceof Object
          ? (exception.getResponse() as any).message
          : exception.getResponse();

      return ResponseUtil.error(message, status);
    } else {
      // For REST: send JSON response using Express response object
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.getStatus
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const message =
        exception.getResponse() instanceof Object
          ? (exception.getResponse() as any).message
          : exception.getResponse();

      response.status(status).json(ResponseUtil.error(message, status));
    }
  }
}
