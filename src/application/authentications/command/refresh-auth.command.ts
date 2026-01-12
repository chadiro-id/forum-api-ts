import { ApplicationError } from '@main/application/common/errors/application-error';

export class RefreshAuthCommand {
  constructor(public readonly refreshToken: string) {
    if (!this.refreshToken || typeof this.refreshToken !== 'string') {
      throw new ApplicationError('token cannot be empty', 'ARGUMENT_ERROR');
    }
  }
}
