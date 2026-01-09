export class ExecutionContext {
  constructor(
    private req: any,
    private res: any,
  ) {}

  getRequest<T = any>(): T {
    return this.req as T;
  }

  getResponse<T = any>(): T {
    return this.res as T;
  }
}
