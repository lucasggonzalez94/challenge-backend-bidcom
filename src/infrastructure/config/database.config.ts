import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'better-sqlite3' as const,
  database: process.env.DATABASE_PATH || './data/products.sqlite',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
