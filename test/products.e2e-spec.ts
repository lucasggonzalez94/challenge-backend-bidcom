import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { ProductsController } from '../src/presentation/controllers/products.controller.js';
import { CreateProductUseCase } from '../src/application/use-cases/create-product.use-case.js';
import {
  GetProductUseCase,
  GetAllProductsUseCase,
} from '../src/application/use-cases/get-product.use-case.js';
import { SearchProductsUseCase } from '../src/application/use-cases/search-products.use-case.js';
import {
  UpdateProductUseCase,
  PatchProductUseCase,
} from '../src/application/use-cases/update-product.use-case.js';
import { DeleteProductUseCase } from '../src/application/use-cases/delete-product.use-case.js';
import { ProductOrmEntity } from '../src/infrastructure/persistence/typeorm/entities/product.orm-entity.js';
import { ProductTypeOrmRepository } from '../src/infrastructure/persistence/typeorm/repositories/product.typeorm.repository.js';
import { PRODUCT_REPOSITORY } from '../src/domain/repositories/product.repository.interface.js';
import { HttpExceptionFilter } from '../src/presentation/filters/http-exception.filter.js';

describe('ProductsController (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'better-sqlite3',
          database: ':memory:',
          entities: [ProductOrmEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([ProductOrmEntity]),
        CacheModule.register({
          ttl: 0,
          isGlobal: true,
        }),
      ],
      controllers: [ProductsController],
      providers: [
        {
          provide: PRODUCT_REPOSITORY,
          useClass: ProductTypeOrmRepository,
        },
        CreateProductUseCase,
        GetProductUseCase,
        GetAllProductsUseCase,
        SearchProductsUseCase,
        UpdateProductUseCase,
        PatchProductUseCase,
        DeleteProductUseCase,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: false,
        },
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('DELETE FROM products');
  });

  describe('POST /products', () => {
    it('should create a product with all fields', async () => {
      const createDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10,
        category: 'Electronics',
        brand: 'TestBrand',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(createDto)
        .expect(201);

      expect(response.body.id).toMatch(/^prod_/);
      expect(response.body.name).toBe(createDto.name);
      expect(response.body.description).toBe(createDto.description);
      expect(response.body.price).toBe(createDto.price);
      expect(response.body.stock).toBe(createDto.stock);
      expect(response.body.category).toBe(createDto.category);
      expect(response.body.brand).toBe(createDto.brand);
      expect(response.body.createdAt).toBeDefined();
    });

    it('should return 400 for invalid data', async () => {
      const invalidDto = {
        name: '',
        price: -10,
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(invalidDto)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('V0001');
      expect(response.body.traceId).toBeDefined();
    });

    it('should return 400 when required fields are missing', async () => {
      const incompleteDto = {
        name: 'Test Product',
      };

      const response = await request(app.getHttpServer())
        .post('/products')
        .send(incompleteDto)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('V0001');
    });
  });

  describe('GET /products', () => {
    it('should return empty array when no products', async () => {
      const response = await request(app.getHttpServer())
        .get('/products')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product by id', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Test Product',
          price: 99.99,
          category: 'Electronics',
          brand: 'TestBrand',
        })
        .expect(201);

      const productId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('Test Product');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .get('/products/prod_nonexistent')
        .expect(404);

      expect(response.body.error).toBeDefined();
      expect(response.body.code).toBe('P0001');
      expect(response.body.traceId).toBeDefined();
    });
  });

  describe('GET /products/search', () => {
    it('should search products by name', async () => {
      await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Laptop Gaming',
          price: 1500,
          category: 'Electronics',
          brand: 'ASUS',
        })
        .expect(201);

      await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Mouse',
          price: 50,
          category: 'Accessories',
          brand: 'Logitech',
        })
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/products/search')
        .query({ name: 'Laptop' })
        .expect(200);

      expect(response.body.items).toHaveLength(1);
      expect(response.body.items[0].name).toBe('Laptop Gaming');
      expect(response.body.total).toBe(1);
    });

    it('should return paginated results', async () => {
      for (let i = 1; i <= 5; i++) {
        await request(app.getHttpServer())
          .post('/products')
          .send({
            name: `Product ${i}`,
            price: i * 10,
            category: 'Test',
            brand: 'TestBrand',
          })
          .expect(201);
      }

      const response = await request(app.getHttpServer())
        .get('/products/search')
        .query({ limit: 2, offset: 0 })
        .expect(200);

      expect(response.body.items).toHaveLength(2);
      expect(response.body.total).toBe(5);
    });
  });

  describe('PUT /products/:id', () => {
    it('should update a product completely', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Original Name',
          price: 100,
          category: 'Original',
          brand: 'OriginalBrand',
        })
        .expect(201);

      const productId = createResponse.body.id;

      const updateDto = {
        name: 'Updated Name',
        description: 'Updated Description',
        price: 200,
        stock: 50,
        category: 'Updated',
        brand: 'UpdatedBrand',
      };

      const response = await request(app.getHttpServer())
        .put(`/products/${productId}`)
        .send(updateDto)
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe(updateDto.name);
      expect(response.body.description).toBe(updateDto.description);
      expect(response.body.price).toBe(updateDto.price);
      expect(response.body.stock).toBe(updateDto.stock);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .put('/products/prod_nonexistent')
        .send({
          name: 'Updated',
          price: 100,
          category: 'Cat',
          brand: 'Brand',
        })
        .expect(404);

      expect(response.body.code).toBe('P0001');
    });
  });

  describe('PATCH /products/:id', () => {
    it('should partially update a product', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'Original Name',
          price: 100,
          category: 'Original',
          brand: 'OriginalBrand',
        })
        .expect(201);

      const productId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .patch(`/products/${productId}`)
        .send({ name: 'Patched Name', price: 150 })
        .expect(200);

      expect(response.body.id).toBe(productId);
      expect(response.body.name).toBe('Patched Name');
      expect(response.body.price).toBe(150);
      expect(response.body.category).toBe('Original');
      expect(response.body.brand).toBe('OriginalBrand');
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .patch('/products/prod_nonexistent')
        .send({ name: 'Patched' })
        .expect(404);

      expect(response.body.code).toBe('P0001');
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const createResponse = await request(app.getHttpServer())
        .post('/products')
        .send({
          name: 'To Delete',
          price: 100,
          category: 'Cat',
          brand: 'Brand',
        })
        .expect(201);

      const productId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/products/${productId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/products/${productId}`)
        .expect(404);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app.getHttpServer())
        .delete('/products/prod_nonexistent')
        .expect(404);

      expect(response.body.code).toBe('P0001');
    });
  });
});
