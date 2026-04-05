import { Product } from '../product.entity.js';
import {
  NegativePriceException,
  NegativeStockException,
  EmptyProductFieldException,
  ProductFieldTooLongException,
} from '../../exceptions/domain.exceptions.js';

describe('Product Entity', () => {
  const validProductProps = {
    id: 'prod_123',
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    stock: 10,
    category: 'Electronics',
    brand: 'TestBrand',
    createdAt: new Date(),
  };

  describe('valid product creation', () => {
    it('should create a product with valid data', () => {
      const product = new Product(validProductProps);

      expect(product.id).toBe(validProductProps.id);
      expect(product.name).toBe(validProductProps.name);
      expect(product.description).toBe(validProductProps.description);
      expect(product.price).toBe(validProductProps.price);
      expect(product.stock).toBe(validProductProps.stock);
      expect(product.category).toBe(validProductProps.category);
      expect(product.brand).toBe(validProductProps.brand);
      expect(product.createdAt).toBe(validProductProps.createdAt);
    });

    it('should set description to null when not provided', () => {
      const product = new Product({
        ...validProductProps,
        description: undefined,
      });

      expect(product.description).toBeNull();
    });

    it('should allow price of 0', () => {
      const product = new Product({
        ...validProductProps,
        price: 0,
      });

      expect(product.price).toBe(0);
    });

    it('should allow stock of 0', () => {
      const product = new Product({
        ...validProductProps,
        stock: 0,
      });

      expect(product.stock).toBe(0);
    });

    it('should trim whitespace from name, category and brand', () => {
      const product = new Product({
        ...validProductProps,
        name: '  Trimmed Name  ',
        category: '  Trimmed Category  ',
        brand: '  Trimmed Brand  ',
      });

      expect(product.name).toBe('Trimmed Name');
      expect(product.category).toBe('Trimmed Category');
      expect(product.brand).toBe('Trimmed Brand');
    });
  });

  describe('price validation', () => {
    it('should throw NegativePriceException for negative price', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          price: -10,
        });
      }).toThrow(NegativePriceException);
    });

    it('should include price value in error message', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          price: -50.5,
        });
      }).toThrow('Price cannot be negative: -50.5');
    });
  });

  describe('stock validation', () => {
    it('should throw NegativeStockException for negative stock', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          stock: -5,
        });
      }).toThrow(NegativeStockException);
    });

    it('should include stock value in error message', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          stock: -100,
        });
      }).toThrow('Stock cannot be negative: -100');
    });
  });

  describe('name validation', () => {
    it('should throw EmptyProductFieldException for empty name', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          name: '',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw EmptyProductFieldException for whitespace-only name', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          name: '   ',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw ProductFieldTooLongException for name exceeding max length', () => {
      const longName = 'a'.repeat(Product.MAX_NAME_LENGTH + 1);
      expect(() => {
        new Product({
          ...validProductProps,
          name: longName,
        });
      }).toThrow(ProductFieldTooLongException);
    });

    it('should allow name at max length', () => {
      const maxLengthName = 'a'.repeat(Product.MAX_NAME_LENGTH);
      const product = new Product({
        ...validProductProps,
        name: maxLengthName,
      });

      expect(product.name).toBe(maxLengthName);
    });
  });

  describe('category validation', () => {
    it('should throw EmptyProductFieldException for empty category', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          category: '',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw EmptyProductFieldException for whitespace-only category', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          category: '   ',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw ProductFieldTooLongException for category exceeding max length', () => {
      const longCategory = 'a'.repeat(Product.MAX_CATEGORY_LENGTH + 1);
      expect(() => {
        new Product({
          ...validProductProps,
          category: longCategory,
        });
      }).toThrow(ProductFieldTooLongException);
    });
  });

  describe('brand validation', () => {
    it('should throw EmptyProductFieldException for empty brand', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          brand: '',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw EmptyProductFieldException for whitespace-only brand', () => {
      expect(() => {
        new Product({
          ...validProductProps,
          brand: '   ',
        });
      }).toThrow(EmptyProductFieldException);
    });

    it('should throw ProductFieldTooLongException for brand exceeding max length', () => {
      const longBrand = 'a'.repeat(Product.MAX_BRAND_LENGTH + 1);
      expect(() => {
        new Product({
          ...validProductProps,
          brand: longBrand,
        });
      }).toThrow(ProductFieldTooLongException);
    });
  });
});
