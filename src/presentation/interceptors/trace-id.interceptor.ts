import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import type { Request, Response } from 'express';

export const TRACE_ID_HEADER = 'x-trace-id';

@Injectable()
export class TraceIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<Request>();
    const traceId = (request.headers[TRACE_ID_HEADER] as string) || uuidv4();

    request.headers[TRACE_ID_HEADER] = traceId;

    const response = context.switchToHttp().getResponse<Response>();
    response.setHeader(TRACE_ID_HEADER, traceId);

    return next.handle();
  }
}
