export class Product {
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
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.price = props.price;
    this.stock = props.stock;
    this.category = props.category;
    this.brand = props.brand;
    this.createdAt = props.createdAt;
  }
}
