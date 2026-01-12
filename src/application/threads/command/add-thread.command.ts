import { ApplicationError } from '@main/application/common/errors/application-error';
import { UserId } from '../../../domain/users/user';

export class AddThreadCommand {
  public readonly title: string;
  public readonly body: string;
  public readonly userId: UserId;

  constructor(title: string, body: string, userId: string) {
    this.userId = new UserId(userId);
    if (!title || !body) {
      throw new ApplicationError('missing arguments', 'ARGUMENT_ERROR');
    }

    if (typeof title !== 'string' || typeof body !== 'string') {
      throw new ApplicationError('invalid data type', 'ARGUMENT_ERROR');
    }
  }
}
