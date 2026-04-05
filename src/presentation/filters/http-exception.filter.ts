import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  DomainException,
  ProductNotFoundException,
  CannotDeleteProductWithStockException,
} from '../../domain/exceptions/domain.exceptions.js';
import { TRACE_ID_HEADER } from '../interceptors/trace-id.interceptor.js';

interface StandardError {
  error: string;
  code: string;
  traceId: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const traceId = (request.headers[TRACE_ID_HEADER] as string) || 'unknown';

    let status: number;
    let errorResponse: StandardError;

    if (exception instanceof ProductNotFoundException) {
      status = HttpStatus.NOT_FOUND;
      errorResponse = {
        error: exception.message,
        code: exception.code,
        traceId,
      };
    } else if (exception instanceof CannotDeleteProductWithStockException) {
      status = HttpStatus.CONFLICT;
      errorResponse = {
        error: exception.message,
        code: exception.code,
        traceId,
      };
    } else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      errorResponse = {
        error: exception.message,
        code: exception.code,
        traceId,
      };
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let errorMessage: string;
      if (typeof exceptionResponse === 'string') {
        errorMessage = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const responseObj = exceptionResponse as Record<string, unknown>;
        if (Array.isArray(responseObj.message)) {
          errorMessage = responseObj.message.join(', ');
        } else if (typeof responseObj.message === 'string') {
          errorMessage = responseObj.message;
        } else {
          errorMessage = exception.message;
        }
      } else {
        errorMessage = exception.message;
      }

      errorResponse = {
        error: errorMessage,
        code: status === (HttpStatus.BAD_REQUEST as number) ? 'V0001' : 'S0001',
        traceId,
      };
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse = {
        error: 'Internal server error',
        code: 'S0001',
        traceId,
      };
    }

    response.status(status).json(errorResponse);
  }
}
