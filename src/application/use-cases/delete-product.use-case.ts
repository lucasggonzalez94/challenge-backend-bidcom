import { Inject, Injectable } from '@nestjs/common';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import { ProductNotFoundException } from '../../domain/exceptions/domain.exceptions.js';

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const exists = await this.productRepository.exists(id);

    if (!exists) {
      throw new ProductNotFoundException(id);
    }

    await this.productRepository.delete(id);
  }
}
