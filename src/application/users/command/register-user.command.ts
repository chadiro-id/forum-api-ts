import { ApplicationError } from '@main/application/common/errors/application-error';

export class RegisterUserCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
    public readonly fullname: string,
  ) {
    if (!this.username || !this.password || !this.fullname) {
      throw new ApplicationError('missing arguments', 'ARGUMENT_ERROR');
    }

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      typeof fullname !== 'string'
    ) {
      throw new ApplicationError('invalid data type', 'ARGUMENT_ERROR');
    }
  }
}
