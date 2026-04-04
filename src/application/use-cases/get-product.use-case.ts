import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import { ProductNotFoundException } from '../../domain/exceptions/domain.exceptions.js';

@Injectable()
export class GetProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    return product;
  }
}

@Injectable()
export class GetAllProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.findAll();
  }
}
