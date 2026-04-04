import {
  GetProductUseCase,
  GetAllProductsUseCase,
} from '../get-product.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { ProductNotFoundException } from '../../../domain/exceptions/domain.exceptions.js';

describe('GetProductUseCase', () => {
  let useCase: GetProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const mockProduct = new Product({
    id: 'prod_123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Electronics',
    brand: 'TestBrand',
    createdAt: new Date(),
  });

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

    useCase = new GetProductUseCase(mockRepository);
  });

  it('should return a product when found', async () => {
    mockRepository.findById.mockResolvedValue(mockProduct);

    const result = await useCase.execute('prod_123');

    expect(result).toEqual(mockProduct);
    expect(mockRepository.findById).toHaveBeenCalledWith('prod_123');
  });

  it('should throw ProductNotFoundException when product not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('prod_nonexistent')).rejects.toThrow(
      ProductNotFoundException,
    );
    expect(mockRepository.findById).toHaveBeenCalledWith('prod_nonexistent');
  });
});

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const mockProducts = [
    new Product({
      id: 'prod_1',
      name: 'Product 1',
      price: 10,
      stock: 5,
      category: 'Cat1',
      brand: 'Brand1',
      createdAt: new Date(),
    }),
    new Product({
      id: 'prod_2',
      name: 'Product 2',
      price: 20,
      stock: 10,
      category: 'Cat2',
      brand: 'Brand2',
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

    useCase = new GetAllProductsUseCase(mockRepository);
  });

  it('should return all products', async () => {
    mockRepository.findAll.mockResolvedValue(mockProducts);

    const result = await useCase.execute();

    expect(result).toEqual(mockProducts);
    expect(result).toHaveLength(2);
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no products', async () => {
    mockRepository.findAll.mockResolvedValue([]);

    const result = await useCase.execute();

    expect(result).toEqual([]);
    expect(result).toHaveLength(0);
  });
});
