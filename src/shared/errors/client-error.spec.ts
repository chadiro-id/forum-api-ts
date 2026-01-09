import { ClientError } from './client-error';

class TestClientError extends ClientError {
  constructor(message: string = 'Test client error', statusCode?: number) {
    super(message, statusCode);
    this.name = 'TestClientError';
  }
}

describe('ClientError', () => {
  it('should throw error when create instance directly', () => {
    // @ts-expect-error -- Cannot create instance of abstract class
    expect(() => new ClientError()).toThrow(
      'Cannot create instance of an abstract class',
    );
  });

  it('should be instance of Error', () => {
    const testError = new TestClientError();

    expect(testError).toBeInstanceOf(Error);
    expect(testError).toBeInstanceOf(ClientError);
  });

  it('should define needed property', () => {
    const testError = new TestClientError();

    expect(testError).toHaveProperty('name');
    expect(testError).toHaveProperty('message');
    expect(testError).toHaveProperty('statusCode');
  });

  it('should have default statusCode 400', () => {
    const testError = new TestClientError();

    expect(testError.statusCode).toBe(400);
  });

  it('should throw error when statusCode out of range 400 to 499', () => {
    expect(() => new TestClientError(undefined, 399)).toThrow(
      'Status code must be in range 400 to 499',
    );
    expect(() => new TestClientError(undefined, 500)).toThrow(
      'Status code must be in range 400 to 499',
    );
  });
});
