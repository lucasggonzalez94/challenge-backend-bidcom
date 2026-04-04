import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { CreateProductDto } from '../../application/dtos/create-product.dto.js';
import {
  UpdateProductDto,
  PatchProductDto,
} from '../../application/dtos/update-product.dto.js';
import { SearchProductsDto } from '../../application/dtos/search-products.dto.js';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import {
  GetProductUseCase,
  GetAllProductsUseCase,
} from '../../application/use-cases/get-product.use-case.js';
import { SearchProductsUseCase } from '../../application/use-cases/search-products.use-case.js';
import {
  UpdateProductUseCase,
  PatchProductUseCase,
} from '../../application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from '../../application/use-cases/delete-product.use-case.js';
import { Product } from '../../domain/entities/product.entity.js';
import type { SearchProductsResult } from '../../domain/repositories/product.repository.interface.js';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductUseCase: GetProductUseCase,
    private readonly getAllProductsUseCase: GetAllProductsUseCase,
    private readonly searchProductsUseCase: SearchProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly patchProductUseCase: PatchProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Get('search')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  async search(
    @Query() query: SearchProductsDto,
  ): Promise<SearchProductsResult> {
    return this.searchProductsUseCase.execute(query);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  async findAll(): Promise<Product[]> {
    return this.getAllProductsUseCase.execute();
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(30000)
  async findOne(@Param('id') id: string): Promise<Product> {
    return this.getProductUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.createProductUseCase.execute(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProductUseCase.execute(id, updateProductDto);
  }

  @Patch(':id')
  async patch(
    @Param('id') id: string,
    @Body() patchProductDto: PatchProductDto,
  ): Promise<Product> {
    return this.patchProductUseCase.execute(id, patchProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.deleteProductUseCase.execute(id);
  }
}
