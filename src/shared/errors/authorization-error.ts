import { ClientError } from './client-error';

export class AuthorizationError extends ClientError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}
