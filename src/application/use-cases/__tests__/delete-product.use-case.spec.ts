import { DeleteProductUseCase } from '../delete-product.use-case.js';
import type { IProductRepository } from '../../../domain/repositories/product.repository.interface.js';
import { ProductNotFoundException } from '../../../domain/exceptions/domain.exceptions.js';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
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

    useCase = new DeleteProductUseCase(mockRepository);
  });

  it('should delete a product when it exists', async () => {
    mockRepository.exists.mockResolvedValue(true);
    mockRepository.delete.mockResolvedValue(undefined);

    await useCase.execute('prod_123');

    expect(mockRepository.exists).toHaveBeenCalledWith('prod_123');
    expect(mockRepository.delete).toHaveBeenCalledWith('prod_123');
  });

  it('should throw ProductNotFoundException when product does not exist', async () => {
    mockRepository.exists.mockResolvedValue(false);

    await expect(useCase.execute('prod_nonexistent')).rejects.toThrow(
      ProductNotFoundException,
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
