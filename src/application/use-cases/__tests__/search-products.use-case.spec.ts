import { SearchProductsUseCase } from '../search-products.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { SearchProductsDto } from '../../dtos/search-products.dto.js';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const mockProducts = [
    new Product({
      id: 'prod_1',
      name: 'Laptop',
      price: 1000,
      stock: 5,
      category: 'Electronics',
      brand: 'Dell',
      createdAt: new Date(),
    }),
    new Product({
      id: 'prod_2',
      name: 'Laptop Pro',
      price: 1500,
      stock: 3,
      category: 'Electronics',
      brand: 'Apple',
      createdAt: new Date(),
    }),
  ];

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      search: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    useCase = new SearchProductsUseCase(mockRepository);
  });

  it('should search products with all filters', async () => {
    const dto: SearchProductsDto = {
      name: 'Laptop',
      category: 'Electronics',
      brand: 'Dell',
      minPrice: 500,
      maxPrice: 1500,
      limit: 10,
      offset: 0,
    };

    mockRepository.search.mockResolvedValue({
      items: [mockProducts[0]],
      total: 1,
    });

    const result = await useCase.execute(dto);

    expect(result.items).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(mockRepository.search).toHaveBeenCalledWith({
      name: 'Laptop',
      category: 'Electronics',
      brand: 'Dell',
      minPrice: 500,
      maxPrice: 1500,
      limit: 10,
      offset: 0,
    });
  });

  it('should search with default pagination', async () => {
    const dto = new SearchProductsDto();

    mockRepository.search.mockResolvedValue({
      items: mockProducts,
      total: 2,
    });

    const result = await useCase.execute(dto);

    expect(result.items).toHaveLength(2);
    expect(mockRepository.search).toHaveBeenCalledWith({
      name: undefined,
      category: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      limit: 20,
      offset: 0,
    });
  });

  it('should return empty results when no matches', async () => {
    const dto: SearchProductsDto = {
      name: 'NonExistent',
      limit: 20,
      offset: 0,
    };

    mockRepository.search.mockResolvedValue({
      items: [],
      total: 0,
    });

    const result = await useCase.execute(dto);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
