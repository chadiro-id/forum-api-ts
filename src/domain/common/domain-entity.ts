export abstract class EntityId<T extends string | number = string> {
  public readonly value: T;

  constructor(value: T | null) {
    this.value = value as T;
  }

  equals(other: unknown) {
    if (other instanceof EntityId === false) {
      return false;
    }
    return JSON.stringify(other) === JSON.stringify(this);
  }

  toString() {
    return `${this.value}`;
  }
}

export abstract class DomainEntity<TId extends EntityId<string | number>> {
  protected _id: TId;

  constructor(id: TId) {
    this._id = id;
  }

  get id() {
    return this._id;
  }

  equals(other: unknown): boolean {
    if (
      other instanceof DomainEntity === false ||
      other.constructor !== this.constructor
    ) {
      return false;
    }

    return this._id.equals(other._id);
  }
}
