import { ApplicationError } from '@main/application/common/errors/application-error';

export class ThreadNotFoundError extends ApplicationError {
  constructor(threadId?: string) {
    const message = threadId
      ? `Cannot find thread with id "${threadId}"`
      : 'Cannot find thread';

    super(message, 'KEY_NOT_FOUND_ERROR');
    this.name = 'ThreadNotFoundError';
  }
}
