import { DomainError } from '../../../domain/common/domain-error';

export type ApplicationErrorCode =
  | 'APPLICATION_ERROR'
  | 'USERNAME_ALREADY_EXISTS_ERROR'
  | 'NON_EXISTENCE_USER_LOGIN_ERROR'
  | 'INVALID_LOGIN_CREDENTIALS_ERROR'
  | 'KEY_NOT_FOUND_ERROR'
  | 'DECEPTIVE_ACCESS_ERROR'
  | 'UNAUTHORIZED_ACCESS_ERROR'
  | 'INVALID_OPERATIONS_ERROR';

export class ApplicationError extends DomainError {
  constructor(message: string, code: ApplicationErrorCode) {
    super(message, code);
    this.name = 'ApplicationError';
  }
}
