import {
  UpdateProductUseCase,
  PatchProductUseCase,
} from '../update-product.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { Product } from '../../../domain/entities/product.entity.js';
import { ProductNotFoundException } from '../../../domain/exceptions/domain.exceptions.js';
import {
  UpdateProductDto,
  PatchProductDto,
} from '../../dtos/update-product.dto.js';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const existingProduct = new Product({
    id: 'prod_123',
    name: 'Old Name',
    description: 'Old Description',
    price: 50,
    stock: 5,
    category: 'OldCategory',
    brand: 'OldBrand',
    createdAt: new Date('2024-01-01'),
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

    useCase = new UpdateProductUseCase(mockRepository);
  });

  it('should update a product completely', async () => {
    const dto: UpdateProductDto = {
      name: 'New Name',
      description: 'New Description',
      price: 100,
      stock: 20,
      category: 'NewCategory',
      brand: 'NewBrand',
    };

    mockRepository.findById.mockResolvedValue(existingProduct);
    mockRepository.update.mockImplementation((product: Product) =>
      Promise.resolve(product),
    );

    const result = await useCase.execute('prod_123', dto);

    expect(result.id).toBe('prod_123');
    expect(result.name).toBe(dto.name);
    expect(result.description).toBe(dto.description);
    expect(result.price).toBe(dto.price);
    expect(result.stock).toBe(dto.stock);
    expect(result.category).toBe(dto.category);
    expect(result.brand).toBe(dto.brand);
    expect(result.createdAt).toEqual(existingProduct.createdAt);
  });

  it('should throw ProductNotFoundException when product not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const dto: UpdateProductDto = {
      name: 'New Name',
      price: 100,
      category: 'NewCategory',
      brand: 'NewBrand',
    };

    await expect(useCase.execute('prod_nonexistent', dto)).rejects.toThrow(
      ProductNotFoundException,
    );
  });
});

describe('PatchProductUseCase', () => {
  let useCase: PatchProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const existingProduct = new Product({
    id: 'prod_123',
    name: 'Old Name',
    description: 'Old Description',
    price: 50,
    stock: 5,
    category: 'OldCategory',
    brand: 'OldBrand',
    createdAt: new Date('2024-01-01'),
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

    useCase = new PatchProductUseCase(mockRepository);
  });

  it('should update only provided fields', async () => {
    const dto: PatchProductDto = {
      name: 'New Name',
      price: 100,
    };

    mockRepository.findById.mockResolvedValue(existingProduct);
    mockRepository.update.mockImplementation((product: Product) =>
      Promise.resolve(product),
    );

    const result = await useCase.execute('prod_123', dto);

    expect(result.name).toBe('New Name');
    expect(result.price).toBe(100);
    expect(result.description).toBe(existingProduct.description);
    expect(result.stock).toBe(existingProduct.stock);
    expect(result.category).toBe(existingProduct.category);
    expect(result.brand).toBe(existingProduct.brand);
  });

  it('should throw ProductNotFoundException when product not found', async () => {
    mockRepository.findById.mockResolvedValue(null);

    const dto: PatchProductDto = { name: 'New Name' };

    await expect(useCase.execute('prod_nonexistent', dto)).rejects.toThrow(
      ProductNotFoundException,
    );
  });
});
