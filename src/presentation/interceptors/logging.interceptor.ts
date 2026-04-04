import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import type { Request, Response } from 'express';
import { LoggerService } from '../../shared/logger/logger.service.js';
import { TRACE_ID_HEADER } from './trace-id.interceptor.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url } = request;
    const traceId = request.headers[TRACE_ID_HEADER] as string;
    const startTime = Date.now();

    this.logger.log(`[${traceId}] ${method} ${url} - Started`, 'HTTP');

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const response = context.switchToHttp().getResponse<Response>();
          this.logger.log(
            `[${traceId}] ${method} ${url} - ${response.statusCode} (${duration}ms)`,
            'HTTP',
          );
        },
        error: (error: Error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${traceId}] ${method} ${url} - Error (${duration}ms): ${error.message}`,
            error.stack,
            'HTTP',
          );
        },
      }),
    );
  }
}
