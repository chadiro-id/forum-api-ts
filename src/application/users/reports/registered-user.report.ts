import { User } from '../../../domain/users/user';

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
