import { ProductMapper } from '../product.mapper.js';
import { Product } from '../../../../domain/entities/product.entity.js';
import { ProductOrmEntity } from '../../typeorm/entities/product.orm-entity.js';

describe('ProductMapper', () => {
  const testDate = new Date('2024-01-15T10:30:00Z');

  describe('toDomain', () => {
    it('should map ORM entity to domain entity', () => {
      const ormEntity = new ProductOrmEntity();
      ormEntity.id = 'prod_123';
      ormEntity.name = 'Test Product';
      ormEntity.description = 'Test Description';
      ormEntity.price = 99.99;
      ormEntity.stock = 10;
      ormEntity.category = 'Electronics';
      ormEntity.brand = 'TestBrand';
      ormEntity.createdAt = testDate;

      const result = ProductMapper.toDomain(ormEntity);

      expect(result).toBeInstanceOf(Product);
      expect(result.id).toBe('prod_123');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(99.99);
      expect(result.stock).toBe(10);
      expect(result.category).toBe('Electronics');
      expect(result.brand).toBe('TestBrand');
      expect(result.createdAt).toEqual(testDate);
    });

    it('should handle null description', () => {
      const ormEntity = new ProductOrmEntity();
      ormEntity.id = 'prod_123';
      ormEntity.name = 'Test Product';
      ormEntity.description = null;
      ormEntity.price = 99.99;
      ormEntity.stock = 10;
      ormEntity.category = 'Electronics';
      ormEntity.brand = 'TestBrand';
      ormEntity.createdAt = testDate;

      const result = ProductMapper.toDomain(ormEntity);

      expect(result.description).toBeNull();
    });

    it('should convert string price to number', () => {
      const ormEntity = new ProductOrmEntity();
      ormEntity.id = 'prod_123';
      ormEntity.name = 'Test Product';
      ormEntity.description = null;
      ormEntity.price = '99.99' as unknown as number;
      ormEntity.stock = 10;
      ormEntity.category = 'Electronics';
      ormEntity.brand = 'TestBrand';
      ormEntity.createdAt = testDate;

      const result = ProductMapper.toDomain(ormEntity);

      expect(result.price).toBe(99.99);
      expect(typeof result.price).toBe('number');
    });
  });

  describe('toOrm', () => {
    it('should map domain entity to ORM entity', () => {
      const domainEntity = new Product({
        id: 'prod_123',
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        brand: 'TestBrand',
        createdAt: testDate,
      });

      const result = ProductMapper.toOrm(domainEntity);

      expect(result).toBeInstanceOf(ProductOrmEntity);
      expect(result.id).toBe('prod_123');
      expect(result.name).toBe('Test Product');
      expect(result.description).toBe('Test Description');
      expect(result.price).toBe(99.99);
      expect(result.stock).toBe(10);
      expect(result.category).toBe('Electronics');
      expect(result.brand).toBe('TestBrand');
      expect(result.createdAt).toEqual(testDate);
    });

    it('should handle null description in domain entity', () => {
      const domainEntity = new Product({
        id: 'prod_123',
        name: 'Test Product',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        brand: 'TestBrand',
        createdAt: testDate,
      });

      const result = ProductMapper.toOrm(domainEntity);

      expect(result.description).toBeNull();
    });
  });
});
