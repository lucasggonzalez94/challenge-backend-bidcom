# Products API

API REST para gestión de productos desarrollada con **NestJS**, **TypeScript**, **TypeORM** y **SQLite**.

## Descripción

API REST completa que implementa operaciones CRUD para productos.

## Características

- ✅ **Clean Architecture**: Separación en capas (Domain, Application, Infrastructure, Presentation)
- ✅ **Principios SOLID**: Inyección de dependencias, responsabilidad única, abierto/cerrado
- ✅ **TypeORM**: ORM con SQLite
- ✅ **Validación**: Validación automática de DTOs con decoradores
- ✅ **Caché**: Caché en memoria con TTL configurable
- ✅ **Logging**: Logging con Pino
- ✅ **Manejo de Errores**: Filtros globales y excepciones personalizadas
- ✅ **Tests**: Tests unitarios y tests e2e
- ✅ **Docker**: Imagen multi-stage optimizada y docker-compose

## Instalación

```bash
npm install
```

## Ejecución

```bash
# Desarrollo
npm run start

# Modo watch (desarrollo con reinicio automático)
npm run start:dev

# Producción
npm run start:prod
```

## Tests

```bash
# Tests unitarios
npm run test

# Tests e2e (integración)
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## Docker

### Build de la imagen

```bash
docker build -t products-api:latest .
```

### Ejecutar con docker-compose

```bash
docker-compose up -d
```

La API estará disponible en `http://localhost:3000`
```

## Endpoints

### Productos

- `POST /products` - Crear producto
- `GET /products` - Obtener todos los productos
- `GET /products/:id` - Obtener producto por ID
- `GET /products/search` - Buscar productos (con filtros y paginación)
- `PUT /products/:id` - Actualizar producto completamente
- `PATCH /products/:id` - Actualizar producto parcialmente
- `DELETE /products/:id` - Eliminar producto

## Variables de Entorno

```env
NODE_ENV=production
DATABASE_PATH=./data/products.sqlite
```
