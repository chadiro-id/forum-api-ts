import { DomainEntity, EntityId } from '../common/domain-entity';
import { DomainError } from '../common/domain-error';
import { UserId } from '../users/user';

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

  private constructor(
    id: ThreadId,
    ownerId: UserId,
    title: string,
    body: string,
    createdAt: Date,
  ) {
    super(id);

    this.ownerId = ownerId;
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
  }

  static create(
    id: ThreadId,
    ownerId: UserId,
    title: string,
    body: string,
    createdAt: Date = new Date(),
  ) {
    if (title.length > 255) {
      throw new DomainError('Title max 255 character', 'THREAD_INVALID_TITLE');
    }

    return new Thread(id, ownerId, title, body, createdAt);
  }
}
