export class LoggedInUserReport {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}
