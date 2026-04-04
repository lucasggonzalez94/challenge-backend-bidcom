import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Product } from '../../../../domain/entities/product.entity.js';
import type {
  IProductRepository,
  SearchProductsParams,
  SearchProductsResult,
} from '../../../../domain/repositories/product.repository.interface.js';
import { ProductOrmEntity } from '../entities/product.orm-entity.js';
import { ProductMapper } from '../../mappers/product.mapper.js';

@Injectable()
export class ProductTypeOrmRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly repository: Repository<ProductOrmEntity>,
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({
      order: { createdAt: 'DESC' },
    });
    return entities.map((entity) => ProductMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? ProductMapper.toDomain(entity) : null;
  }

  async search(params: SearchProductsParams): Promise<SearchProductsResult> {
    const where: FindOptionsWhere<ProductOrmEntity> = {};

    if (params.name) {
      where.name = Like(`%${params.name}%`);
    }

    if (params.category) {
      where.category = params.category;
    }

    if (params.brand) {
      where.brand = params.brand;
    }

    if (params.minPrice !== undefined && params.maxPrice !== undefined) {
      where.price = Between(params.minPrice, params.maxPrice);
    } else if (params.minPrice !== undefined) {
      where.price = MoreThanOrEqual(params.minPrice);
    } else if (params.maxPrice !== undefined) {
      where.price = LessThanOrEqual(params.maxPrice);
    }

    const [entities, total] = await this.repository.findAndCount({
      where,
      take: params.limit,
      skip: params.offset,
      order: { createdAt: 'DESC' },
    });

    return {
      items: entities.map((entity) => ProductMapper.toDomain(entity)),
      total,
    };
  }

  async create(product: Product): Promise<Product> {
    const ormEntity = ProductMapper.toOrm(product);
    const saved = await this.repository.save(ormEntity);
    return ProductMapper.toDomain(saved);
  }

  async update(product: Product): Promise<Product> {
    const ormEntity = ProductMapper.toOrm(product);
    const saved = await this.repository.save(ormEntity);
    return ProductMapper.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async exists(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }
}
