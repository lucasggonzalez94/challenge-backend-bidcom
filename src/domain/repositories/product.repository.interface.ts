import { Product } from '../entities/product.entity.js';

export interface SearchProductsParams {
  name?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  limit: number;
  offset: number;
}

export interface SearchProductsResult {
  items: Product[];
  total: number;
}

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  search(params: SearchProductsParams): Promise<SearchProductsResult>;
  create(product: Product): Promise<Product>;
  update(product: Product): Promise<Product>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}

export const PRODUCT_REPOSITORY = Symbol('IProductRepository');
