export type ApplicationErrorCode =
  | 'APPLICATION_ERROR'
  | 'NON_EXISTENCE_ERROR'
  | 'ARGUMENT_ERROR'
  | 'CONFLICT_ERROR'
  | 'AUTHENTICATION_ERROR'
  | 'KEY_NOT_FOUND_ERROR'
  | 'DECEPTIVE_ACCESS_ERROR'
  | 'UNAUTHORIZED_ACCESS_ERROR'
  | 'INVALID_OPERATION_ERROR';

export class ApplicationError extends Error {
  public readonly code: ApplicationErrorCode;

  constructor(message: string, code: ApplicationErrorCode) {
    super(message);

    this.code = code;
    this.name = 'ApplicationError';
  }
}
