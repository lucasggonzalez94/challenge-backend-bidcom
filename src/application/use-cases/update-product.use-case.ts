import { Inject, Injectable } from '@nestjs/common';
import { Product } from '../../domain/entities/product.entity.js';
import type { IProductRepository } from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import { ProductNotFoundException } from '../../domain/exceptions/domain.exceptions.js';
import {
  UpdateProductDto,
  PatchProductDto,
} from '../dtos/update-product.dto.js';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    const updatedProduct = new Product({
      id: existingProduct.id,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      stock: dto.stock ?? existingProduct.stock,
      category: dto.category,
      brand: dto.brand,
      createdAt: existingProduct.createdAt,
    });

    return this.productRepository.update(updatedProduct);
  }
}

@Injectable()
export class PatchProductUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(id: string, dto: PatchProductDto): Promise<Product> {
    const existingProduct = await this.productRepository.findById(id);

    if (!existingProduct) {
      throw new ProductNotFoundException(id);
    }

    const updatedProduct = new Product({
      id: existingProduct.id,
      name: dto.name ?? existingProduct.name,
      description: dto.description ?? existingProduct.description,
      price: dto.price ?? existingProduct.price,
      stock: dto.stock ?? existingProduct.stock,
      category: dto.category ?? existingProduct.category,
      brand: dto.brand ?? existingProduct.brand,
      createdAt: existingProduct.createdAt,
    });

    return this.productRepository.update(updatedProduct);
  }
}
