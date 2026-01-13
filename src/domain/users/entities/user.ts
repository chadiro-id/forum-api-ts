import { DomainEntity, EntityId } from '../../common/domain-entity';
import { DomainError } from '../../common/domain-error';

export class UserId extends EntityId {
  readonly __brand = 'UserId';

  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('ID must be non-empty string', 'INVALID_USER_ID');
    }
    super(value);
  }
}

export class User extends DomainEntity<UserId> {
  public readonly username: string;
  public readonly password: string;
  public readonly fullname: string;
  public readonly createdAt: Date;

  private constructor(
    id: UserId,
    username: string,
    password: string,
    fullname: string,
    createdAt: Date,
  ) {
    super(id);

    this.username = username;
    this.password = password;
    this.fullname = fullname;
    this.createdAt = createdAt;
  }

  static create(
    id: UserId,
    username: string,
    password: string,
    fullname: string,
    createdAt: Date = new Date(),
  ) {
    if (username.length > 50) {
      throw new DomainError(
        'username max 50 character',
        'USER_INVALID_USERNAME',
      );
    }

    if (!username.match(/^[\w]+$/)) {
      throw new DomainError(
        'username contain restricted character',
        'USER_INVALID_USERNAME',
      );
    }
    return new User(id, username, password, fullname, createdAt);
  }
}
