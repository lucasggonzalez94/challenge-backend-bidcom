import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import {
  ProductNotFoundException,
  CannotDeleteProductWithStockException,
} from '../../domain/exceptions/domain.exceptions.js';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new ProductNotFoundException(id);
    }

    if (product.stock > 0) {
      throw new CannotDeleteProductWithStockException(id, product.stock);
    }

    await this.productRepository.delete(id);
  }
}
