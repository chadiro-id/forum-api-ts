import { UserId } from '../../../domain/entities/user';

export class AddThreadCommand {
  constructor(
    public readonly title: string,
    public readonly body: string,
    public readonly userId: UserId,
  ) {}
}
