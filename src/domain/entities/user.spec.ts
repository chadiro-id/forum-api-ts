import { DomainError } from '../common/domain-error';
import { User, UserId } from './user';

describe('UserId', () => {
  it('should create instance with valid value', () => {
    const id = new UserId('user-123');

    expect(id.__brand).toBe('UserId');
    expect(id.value).toBe('user-123');
  });

  it('should throw error when value is not valid', () => {
    expect(() => new UserId(123 as unknown as string)).toThrow(DomainError);
    expect(() => new UserId('')).toThrow('ID must be non-empty string');
  });
});

describe('User Entity', () => {
  const id = new UserId('user-123');
  const username = 'johndoe';
  const password = 'p455w0rd';
  const fullname = 'John Doe';
  const creationDate = new Date();

  describe('constructor', () => {
    it('should create instance with valid data', () => {
      const entity = new User(id, username, password, fullname, creationDate);

      expect(entity.id).toStrictEqual(id);
      expect(entity.username).toBe(username);
      expect(entity.password).toBe(password);
      expect(entity.fullname).toBe(fullname);
      expect(entity.createdAt).toStrictEqual(creationDate);
    });
  });

  describe('create', () => {
    it('should create User with correct creation date', () => {
      const user = User.create(id, username, password, fullname);

      const timeDiff = Math.abs(Date.now() - user.createdAt.getTime());
      expect(timeDiff < 10000).toBe(true);
    });
  });
});
