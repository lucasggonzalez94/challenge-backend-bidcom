import { DeleteProductUseCase } from '../delete-product.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { Product } from '../../../domain/entities/product.entity.js';
import {
  ProductNotFoundException,
  CannotDeleteProductWithStockException,
} from '../../../domain/exceptions/domain.exceptions.js';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let mockRepository: jest.Mocked<IProductRepository>;

  const createMockProduct = (overrides: Partial<Product> = {}): Product => {
    return new Product({
      id: 'prod_123',
      name: 'Test Product',
      price: 99.99,
      stock: 0,
      category: 'Electronics',
      brand: 'TestBrand',
      createdAt: new Date(),
      ...overrides,
    });
  };

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

    useCase = new DeleteProductUseCase(mockRepository);
  });

  it('should delete a product when it exists and has no stock', async () => {
    const product = createMockProduct({ stock: 0 });
    mockRepository.findById.mockResolvedValue(product);
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('prod_123');

    expect(mockRepository.findById).toHaveBeenCalledWith('prod_123');
    expect(mockRepository.delete).toHaveBeenCalledWith('prod_123');
  });

  it('should throw ProductNotFoundException when product does not exist', async () => {
    mockRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute('prod_nonexistent')).rejects.toThrow(
      ProductNotFoundException,
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw CannotDeleteProductWithStockException when product has stock', async () => {
    const product = createMockProduct({ stock: 10 });
    mockRepository.findById.mockResolvedValue(product);

    await expect(useCase.execute('prod_123')).rejects.toThrow(
      CannotDeleteProductWithStockException,
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
