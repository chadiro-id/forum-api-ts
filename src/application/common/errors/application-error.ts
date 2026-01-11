import { DomainError } from '../../../domain/common/domain-error';

export type ApplicationErrorCode =
  | 'APPLICATION_ERROR'
  | 'INPUT_VALIDATION_ERROR'
  | 'USERNAME_ALREADY_EXISTS'
  | 'NON_EXISTENCE_USER_LOGIN'
  | 'INVALID_LOGIN_CREDENTIALS'
  | 'NOT_FOUND_ERROR'
  | 'DECEPTIVE_ACCESS_ERROR'
  | 'NOT_AUTHORIZED_ERROR';

export class ApplicationError extends DomainError {
  constructor(
    message: string,
    code: ApplicationErrorCode = 'APPLICATION_ERROR',
  ) {
    super(message, code);
    this.name = 'ApplicationError';
  }
}
