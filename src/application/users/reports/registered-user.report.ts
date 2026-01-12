import { User } from '../../../domain/entities/user';

export class RegisteredUserReport {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly fullname: string,
  ) {}

  static fromEntity(user: User) {
    return new RegisteredUserReport(
      user.id.value,
      user.username,
      user.fullname,
    );
  }
}
