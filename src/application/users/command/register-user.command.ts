import { ApplicationError } from '@main/application/common/errors/application-error';

export class RegisterUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly fullname: string,
  ) {
    this.validate();
  }

  private validate() {
    if (!this.username || typeof this.username !== 'string') {
      throw new ApplicationError(
        'username must be non-empty string',
        'ARGUMENT_ERROR',
      );
    }

    if (!this.password || typeof this.password !== 'string') {
      throw new ApplicationError(
        'password must be non-empty string',
        'ARGUMENT_ERROR',
      );
    }

    if (!this.fullname || typeof this.fullname !== 'string') {
      throw new ApplicationError(
        'password must be non-empty string',
        'ARGUMENT_ERROR',
      );
    }
  }
}
