export class RefreshedAuthReport {
  constructor(public readonly accessToken: string) {}

  toJSON() {
    return Object.assign({}, this);
  }
}
