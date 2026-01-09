import { DomainError } from './domain-error';

describe('DomainError', () => {
  describe('inheritance', () => {
    it('should be instance of Error', () => {
      const error = new DomainError();

      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('constructor', () => {
    it('should correctly create instance', () => {
      const error = new DomainError('Test domain error', 'TEST_ERROR_CODE');

      expect(error.name).toBe('DomainError');
      expect(error.message).toBe('Test domain error');
      expect(error.code).toBe('TEST_ERROR_CODE');
    });

    it('should work with undefined message', () => {
      const error = new DomainError(undefined, 'TEST_CODE');

      expect(error.message).toBe('');
    });

    it('should work with undefined code', () => {
      const error = new DomainError('test message');

      expect(error.code).toBeUndefined();
    });
  });
});
