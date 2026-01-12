import { UserId } from '../../../domain/users/user';

export class AddThreadCommand {
  constructor(
    public readonly title: string,
    public readonly body: string,
    public readonly userId: UserId,
  ) {}
}
