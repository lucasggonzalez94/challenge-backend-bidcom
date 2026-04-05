# Products API

API REST para gestión de productos desarrollada con **NestJS**, **TypeScript**, **TypeORM** y **PostgreSQL**.

## Descripción

API REST completa que implementa operaciones CRUD para productos.

## Características

- ✅ **Clean Architecture**: Separación en capas (Domain, Application, Infrastructure, Presentation)
- ✅ **Principios SOLID**: Inyección de dependencias, responsabilidad única, abierto/cerrado
- ✅ **TypeORM**: ORM con PostgreSQL
- ✅ **Validación**: Validación automática de DTOs con decoradores
- ✅ **Validaciones de Negocio**: Validaciones en entidades de dominio
- ✅ **Caché**: Caché en memoria con TTL configurable
- ✅ **Logging**: Logging estructurado con Pino
- ✅ **Manejo de Errores**: Filtros globales y excepciones personalizadas
- ✅ **Tests**: Tests unitarios y tests e2e
- ✅ **Docker**: Imagen multi-stage optimizada y docker-compose

## Requisitos

- Node.js 20+
- PostgreSQL 16+ (o usar Docker)

## Instalación

```bash
npm install
```

## Base de Datos

### Opción 1: PostgreSQL con Docker (recomendado)

```bash
# Iniciar solo PostgreSQL
docker-compose up -d postgres

# Verificar que está corriendo
docker-compose ps
```

### Opción 2: PostgreSQL local

Configura las variables de entorno en `.env`:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=products_db
```

## Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Tests

```bash
# Tests unitarios
npm run test

# Tests e2e (integración) - usa SQLite in-memory
npm run test:e2e

# Cobertura de tests
npm run test:cov
```

## Docker

### Ejecutar todo con docker-compose

```bash
# Inicia PostgreSQL + API
docker-compose up -d

# Ver logs
docker-compose logs -f products-api
```

La API estará disponible en `http://localhost:3000`

### Build manual de la imagen

```bash
docker build -t products-api:latest .
```

## Endpoints

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/products` | Crear producto |
| `GET` | `/products` | Obtener todos los productos |
| `GET` | `/products/:id` | Obtener producto por ID |
| `GET` | `/products/search` | Buscar productos (con filtros y paginación) |
| `PUT` | `/products/:id` | Actualizar producto completamente |
| `PATCH` | `/products/:id` | Actualizar producto parcialmente |
| `DELETE` | `/products/:id` | Eliminar producto (solo si stock = 0) |

### Parámetros de búsqueda

`GET /products/search` acepta:

- `name` - Filtrar por nombre (búsqueda parcial)
- `category` - Filtrar por categoría
- `brand` - Filtrar por marca
- `minPrice` - Precio mínimo
- `maxPrice` - Precio máximo
- `limit` - Cantidad de resultados (default: 20)
- `offset` - Desplazamiento para paginación (default: 0)

## Variables de Entorno

```env
# Application
PORT=3000
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=products_db
```

## Reglas de Negocio

- El precio no puede ser negativo
- El stock no puede ser negativo
- El nombre, categoría y marca no pueden estar vacíos
- No se puede eliminar un producto con stock > 0
