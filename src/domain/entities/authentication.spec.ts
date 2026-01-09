import { DomainError } from '../common/domain-error';
import { Authentication, AuthenticationId } from './authentication';
import { UserId } from './user';

describe('AuthenticationId', () => {
  it('should create instance with valid value', () => {
    const id = new AuthenticationId(1);

    expect(id['__brand']).toEqual('AuthenticationId');
    expect(id.value).toBe(1);
  });

  it('should work for null value', () => {
    const id = new AuthenticationId();
    expect(id.value).toBeNull();
  });

  it('should throw DomainError when value is not number or null', () => {
    const notNumberValue = '1' as unknown as number;
    const notNullValue = 0 as unknown as null;

    expect(() => new AuthenticationId(notNumberValue)).toThrow(DomainError);
    expect(() => new AuthenticationId(notNullValue)).toThrow(DomainError);
  });

  it('should throw DomainError when value less than 1', () => {
    try {
      new AuthenticationId(0);
    } catch (error) {
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toEqual('ID must be non-negative integer');
      expect(error.code).toEqual('INVALID_AUTHENTICATION_ID');
    }
  });
});

describe('Authentication Entity', () => {
  describe('constructor', () => {
    it('should create instance with valid data', () => {
      const id = new AuthenticationId(null);
      const userId = new UserId('id-user');
      const entity = new Authentication(id, userId, 'token');

      expect(entity.id).toStrictEqual(id);
      expect(entity.userId).toStrictEqual(userId);
      expect(entity.token).toBe('token');
    });
  });

  describe('create', () => {
    it('should create instance with default id null', () => {
      const userId = new UserId('user-123');
      const entity = Authentication.create(userId, 'token');
      expect(entity.id.value).toBeNull();
    });
  });

  describe('assignId', () => {
    it('should correctly assign the given ID', () => {
      const id = new AuthenticationId();
      const userId = new UserId('user-123');
      const entity = new Authentication(id, userId, 'token');
      const idToAssign = new AuthenticationId(1);

      entity.assignId(idToAssign);
      expect(entity.id).toEqual(idToAssign);
    });

    it('should throw DomainError when id already assigned', () => {
      const id = new AuthenticationId(1);
      const userId = new UserId('user-123');
      const entity = new Authentication(id, userId, 'token');

      try {
        entity.assignId(new AuthenticationId(2));
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toBe('ID already assigned');
      }
    });

    it('should throw DomainError when assign id with null value', () => {
      const id = new AuthenticationId();
      const userId = new UserId('user-123');
      const entity = new Authentication(id, userId, 'token');

      try {
        entity.assignId(new AuthenticationId(null));
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toBe('Cannot assign ID with null value');
      }
    });
  });
});
