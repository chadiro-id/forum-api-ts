import { DomainError } from '../../../domain/common/domain-error';

export class ReplyNotFoundError extends DomainError {
  constructor(id?: string) {
    const message = id
      ? `Cannot find reply with id "${id}"`
      : 'Cannot find reply';

    super(message, 'REPLY_NOT_FOUND');
    this.name = 'ReplyNotFoundError';
  }
}
