import { Product } from '../../../domain/entities/product.entity.js';
import { ProductOrmEntity } from '../typeorm/entities/product.orm-entity.js';

export class ProductMapper {
  static toDomain(ormEntity: ProductOrmEntity): Product {
    return new Product({
      id: ormEntity.id,
      name: ormEntity.name,
      description: ormEntity.description,
      price: Number(ormEntity.price),
      stock: ormEntity.stock,
      category: ormEntity.category,
      brand: ormEntity.brand,
      createdAt: ormEntity.createdAt,
    });
  }

  static toOrm(domain: Product): ProductOrmEntity {
    const ormEntity = new ProductOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.name = domain.name;
    ormEntity.description = domain.description;
    ormEntity.price = domain.price;
    ormEntity.stock = domain.stock;
    ormEntity.category = domain.category;
    ormEntity.brand = domain.brand;
    ormEntity.createdAt = domain.createdAt;
    return ormEntity;
  }
}
