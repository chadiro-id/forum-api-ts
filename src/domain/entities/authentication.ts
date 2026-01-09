import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { UserId } from './user';

export class AuthenticationId extends EntityId<number> {
  readonly __brand = 'AuthenticationId';

  constructor(value: number | null = null) {
    if (value !== null) {
      if (typeof value !== 'number' || value < 1) {
        throw new DomainError(
          'ID must be non-negative integer',
          'INVALID_AUTHENTICATION_ID',
        );
      }
    }
    super(value);
  }
}

export class Authentication extends DomainEntity<AuthenticationId> {
  public readonly userId: UserId;
  public readonly token: string;

  constructor(id: AuthenticationId, userId: UserId, token: string) {
    super(id);
    this.userId = userId;
    this.token = token;
  }

  static create(userId: UserId, token: string) {
    const id = new AuthenticationId();
    return new Authentication(id, userId, token);
  }

  assignId(id: AuthenticationId) {
    if (this._id.value) {
      throw new DomainError('ID already assigned', 'AUTHENTICATION_ASSIGN_ID');
    }

    if (id.value === null) {
      throw new DomainError(
        'Cannot assign ID with null value',
        'AUTHENTICATION_ASSIGN_ID',
      );
    }

    this._id = id;
  }
}
