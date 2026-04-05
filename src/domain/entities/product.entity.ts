import {
  NegativePriceException,
  NegativeStockException,
  EmptyProductFieldException,
  ProductFieldTooLongException,
} from '../exceptions/domain.exceptions.js';

export class Product {
  static readonly MAX_NAME_LENGTH = 200;
  static readonly MAX_CATEGORY_LENGTH = 100;
  static readonly MAX_BRAND_LENGTH = 100;

  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly price: number;
  readonly stock: number;
  readonly category: string;
  readonly brand: string;
  readonly createdAt: Date;

  constructor(props: {
    id: string;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    category: string;
    brand: string;
    createdAt: Date;
  }) {
    this.validateName(props.name);
    this.validateCategory(props.category);
    this.validateBrand(props.brand);
    this.validatePrice(props.price);
    this.validateStock(props.stock);

    this.id = props.id;
    this.name = props.name.trim();
    this.description = props.description ?? null;
    this.price = props.price;
    this.stock = props.stock;
    this.category = props.category.trim();
    this.brand = props.brand.trim();
    this.createdAt = props.createdAt;
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new EmptyProductFieldException('name');
    }
    if (name.length > Product.MAX_NAME_LENGTH) {
      throw new ProductFieldTooLongException('name', Product.MAX_NAME_LENGTH);
    }
  }

  private validateCategory(category: string): void {
    if (!category || category.trim().length === 0) {
      throw new EmptyProductFieldException('category');
    }
    if (category.length > Product.MAX_CATEGORY_LENGTH) {
      throw new ProductFieldTooLongException(
        'category',
        Product.MAX_CATEGORY_LENGTH,
      );
    }
  }

  private validateBrand(brand: string): void {
    if (!brand || brand.trim().length === 0) {
      throw new EmptyProductFieldException('brand');
    }
    if (brand.length > Product.MAX_BRAND_LENGTH) {
      throw new ProductFieldTooLongException('brand', Product.MAX_BRAND_LENGTH);
    }
  }

  private validatePrice(price: number): void {
    if (price < 0) {
      throw new NegativePriceException(price);
    }
  }

  private validateStock(stock: number): void {
    if (stock < 0) {
      throw new NegativeStockException(stock);
    }
  }
}
