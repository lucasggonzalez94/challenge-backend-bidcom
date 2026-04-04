import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryColumn()
  id!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  description!: string | null;

  @Column('decimal', { precision: 10, scale: 2 })
  price!: number;

  @Column('integer', { default: 0 })
  stock!: number;

  @Column()
  category!: string;

  @Column()
  brand!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
