import { Inject, Injectable } from '@nestjs/common';
import type {
  IProductRepository,
  SearchProductsResult,
} from '../../domain/repositories/product.repository.interface.js';
import { PRODUCT_REPOSITORY } from '../../domain/repositories/product.repository.interface.js';
import { SearchProductsDto } from '../dtos/search-products.dto.js';

@Injectable()
export class SearchProductsUseCase {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(dto: SearchProductsDto): Promise<SearchProductsResult> {
    return this.productRepository.search({
      name: dto.name,
      category: dto.category,
      brand: dto.brand,
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      limit: dto.limit,
      offset: dto.offset,
    });
  }
}
