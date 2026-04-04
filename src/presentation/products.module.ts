import { Module } from '@nestjs/common';
import { ProductsController } from './controllers/products.controller.js';
import { PersistenceModule } from '../infrastructure/persistence/persistence.module.js';
import { CreateProductUseCase } from '../application/use-cases/create-product.use-case.js';
import {
  GetProductUseCase,
  GetAllProductsUseCase,
} from '../application/use-cases/get-product.use-case.js';
import { SearchProductsUseCase } from '../application/use-cases/search-products.use-case.js';
import {
  UpdateProductUseCase,
  PatchProductUseCase,
} from '../application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from '../application/use-cases/delete-product.use-case.js';

@Module({
  imports: [PersistenceModule],
  controllers: [ProductsController],
  providers: [
    CreateProductUseCase,
    GetProductUseCase,
    GetAllProductsUseCase,
    SearchProductsUseCase,
    UpdateProductUseCase,
    PatchProductUseCase,
    DeleteProductUseCase,
  ],
})
export class ProductsModule {}
