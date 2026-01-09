export class UserLoginCommand {
  constructor(
    public readonly username: string,
    public readonly password: string,
  ) {}
}
