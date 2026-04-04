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
