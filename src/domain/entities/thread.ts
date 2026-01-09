import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { UserId } from './user';

export class ThreadId extends EntityId {
  readonly __brand = 'ThreadId';
  constructor(value: string) {
    if (!value || typeof value !== 'string') {
      throw new DomainError('ID must be non-empty string', 'INVALID_THREAD_ID');
    }
    super(value);
  }
}

export class Thread extends DomainEntity<ThreadId> {
  public readonly ownerId: UserId;
  public readonly title: string;
  public readonly body: string;
  public readonly createdAt: Date;

  constructor(
    id: ThreadId,
    ownerId: UserId,
    title: string,
    body: string,
    createdAt: Date,
  ) {
    super(id);

    this.ownerId = this.validateOwnerId(ownerId);
    this.title = this.validateTitle(title);
    this.body = this.validateBody(body);
    this.createdAt = this.validateCreatedAt(createdAt);
  }

  static create(id: ThreadId, ownerId: UserId, title: string, body: string) {
    const createdAt = new Date();
    return new Thread(id, ownerId, title, body, createdAt);
  }

  private validateOwnerId(value: unknown): UserId {
    if (value instanceof UserId === false) {
      throw new DomainError(undefined, 'THREAD_INVALID_OWNER_ID');
    }
    return value;
  }

  private validateTitle(value: unknown): string {
    if (!value || typeof value !== 'string') {
      throw new DomainError(
        'Title must be non-empty string',
        'THREAD_INVALID_TITLE',
      );
    }

    if (value.length > 255) {
      throw new DomainError('Title max 255 character', 'THREAD_INVALID_TITLE');
    }

    return value;
  }

  private validateBody(value: string): string {
    if (!value || typeof value !== 'string') {
      throw new DomainError(
        'Body must be non-empty string',
        'THREAD_INVALID_BODY',
      );
    }

    return value;
  }

  private validateCreatedAt(value: Date): Date {
    if (
      value instanceof Date === false ||
      Number.isNaN(Date.parse(value.toString()))
    ) {
      throw new DomainError(undefined, 'INVALID_CREATION_DATE');
    }
    return value;
  }
}
