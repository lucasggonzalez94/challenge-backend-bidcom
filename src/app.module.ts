import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ProductsModule } from './presentation/products.module.js';
import { CacheModule } from './infrastructure/cache/cache.module.js';
import { HttpExceptionFilter } from './presentation/filters/http-exception.filter.js';
import { TraceIdInterceptor } from './presentation/interceptors/trace-id.interceptor.js';
import { LoggingInterceptor } from './presentation/interceptors/logging.interceptor.js';
import { LoggerService } from './shared/logger/logger.service.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CacheModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [
    LoggerService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TraceIdInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
