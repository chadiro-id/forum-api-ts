import { ApplicationError } from '@main/application/common/errors/application-error';

export class UserLoginCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {
    if (!this.username || typeof this.username !== 'string') {
      throw new ApplicationError('username cannot be empty', 'ARGUMENT_ERROR');
    }

    if (!this.password || typeof this.password !== 'string') {
      throw new ApplicationError('password cannot be empty', 'ARGUMENT_ERROR');
    }
  }
}
