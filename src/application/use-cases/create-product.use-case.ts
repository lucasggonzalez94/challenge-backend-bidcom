import { Inject, Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../domain/entities/product.entity.js';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import { CreateProductDto } from '../dtos/create-product.dto.js';

@Injectable()
export class CreateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const product = new Product({
      id: `prod_${uuidv4()}`,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.category,
      brand: dto.brand,
      createdAt: new Date(),
    });

    return this.productRepository.create(product);
  }
}
