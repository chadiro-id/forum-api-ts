export abstract class ClientError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    if (new.target === ClientError) {
      throw new Error('Cannot create instance of an abstract class');
    }

    if (statusCode < 400 || statusCode > 499) {
      throw new RangeError('Status code must be in range 400 to 499');
    }

    super(message);
    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}
