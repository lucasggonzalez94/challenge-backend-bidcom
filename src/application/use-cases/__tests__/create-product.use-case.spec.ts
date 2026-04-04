import { CreateProductUseCase } from '../create-product.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { CreateProductDto } from '../../dtos/create-product.dto.js';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

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

    useCase = new CreateProductUseCase(mockRepository);
  });

  it('should create a product with generated id and createdAt', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: 10,
      category: 'Electronics',
      brand: 'TestBrand',
    };

    mockRepository.create.mockImplementation((product: Product) =>
      Promise.resolve(product),
    );

    const result = await useCase.execute(dto);

    expect(result.id).toMatch(/^prod_/);
    expect(result.name).toBe(dto.name);
    expect(result.description).toBe(dto.description);
    expect(result.price).toBe(dto.price);
    expect(result.stock).toBe(dto.stock);
    expect(result.category).toBe(dto.category);
    expect(result.brand).toBe(dto.brand);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(mockRepository.create).toHaveBeenCalledTimes(1);
  });

  it('should set stock to 0 when not provided', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      price: 99.99,
      category: 'Electronics',
      brand: 'TestBrand',
    };

    mockRepository.create.mockImplementation((product: Product) =>
      Promise.resolve(product),
    );

    const result = await useCase.execute(dto);

    expect(result.stock).toBe(0);
  });

  it('should set description to null when not provided', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      price: 99.99,
      category: 'Electronics',
      brand: 'TestBrand',
    };

    mockRepository.create.mockImplementation((product: Product) =>
      Promise.resolve(product),
    );

    const result = await useCase.execute(dto);

    expect(result.description).toBeNull();
  });
});
