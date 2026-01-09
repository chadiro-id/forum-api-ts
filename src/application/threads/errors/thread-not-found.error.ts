import { DomainError } from '../../../domain/common/domain-error';

export class ThreadNotFoundError extends DomainError {
  constructor(threadId?: string) {
    const message = threadId
      ? `Cannot find thread with id "${threadId}"`
      : 'Cannot find thread';

    super(message, 'THREAD_NOT_FOUND');
    this.name = 'ThreadNotFoundError';
  }
}
