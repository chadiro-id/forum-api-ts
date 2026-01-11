export type ApplicationErrorCode =
  | 'APPLICATION_ERROR'
  | 'USERNAME_ALREADY_EXISTS_ERROR'
  | 'NON_EXISTENCE_USER_LOGIN_ERROR'
  | 'INVALID_LOGIN_CREDENTIALS_ERROR'
  | 'KEY_NOT_FOUND_ERROR'
  | 'DECEPTIVE_ACCESS_ERROR'
  | 'UNAUTHORIZED_ACCESS_ERROR'
  | 'INVALID_OPERATIONS_ERROR';

export class ApplicationError extends Error {
  public readonly code: ApplicationErrorCode;

  constructor(message: string, code: ApplicationErrorCode) {
    super(message);

    this.code = code;
    this.name = 'ApplicationError';
  }
}
