import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductOrmEntity } from './typeorm/entities/product.orm-entity.js';
import { ProductTypeOrmRepository } from './typeorm/repositories/product.typeorm.repository.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import databaseConfig from '../config/database.config.js';

@Module({
  imports: [
    ConfigModule.forFeature(databaseConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'better-sqlite3',
        database: configService.get<string>('database.database'),
        entities: [ProductOrmEntity],
        synchronize: configService.get<boolean>('database.synchronize'),
        logging: configService.get<boolean>('database.logging'),
      }),
    }),
    TypeOrmModule.forFeature([ProductOrmEntity]),
  ],
  providers: [
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductTypeOrmRepository,
    },
  ],
  exports: [PRODUCT_REPOSITORY],
})
export class PersistenceModule {}
