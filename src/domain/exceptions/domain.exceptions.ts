export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class ProductNotFoundException extends DomainException {
  readonly code = 'P0001';

  constructor(id: string) {
    super(`Product with id '${id}' not found`);
  }
}

export class InvalidProductDataException extends DomainException {
  readonly code = 'V0001';

  constructor(message: string) {
    super(message);
  }
}

export class NegativePriceException extends DomainException {
  readonly code = 'V0002';

  constructor(price: number) {
    super(`Price cannot be negative: ${price}`);
  }
}

export class NegativeStockException extends DomainException {
  readonly code = 'V0003';

  constructor(stock: number) {
    super(`Stock cannot be negative: ${stock}`);
  }
}

export class EmptyProductFieldException extends DomainException {
  readonly code = 'V0004';

  constructor(field: string) {
    super(`Product ${field} cannot be empty`);
  }
}

export class ProductFieldTooLongException extends DomainException {
  readonly code = 'V0005';

  constructor(field: string, maxLength: number) {
    super(`Product ${field} cannot exceed ${maxLength} characters`);
  }
}

export class CannotDeleteProductWithStockException extends DomainException {
  readonly code = 'P0002';

  constructor(id: string, stock: number) {
    super(`Cannot delete product '${id}' with ${stock} items in stock`);
  }
}
