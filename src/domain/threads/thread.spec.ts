import { DomainError } from '../common/domain-error';
import { Thread, ThreadId } from './thread';
import { UserId } from '../entities/user';

describe('ThreadId', () => {
  it('should create instance with valid value', () => {
    const id = new ThreadId('thread-123');

    expect(id.__brand).toBe('ThreadId');
    expect(id.value).toBe('thread-123');
  });

  it('should throw error when value is not valid', () => {
    const notString = 123 as unknown as string;

    expect(() => new ThreadId(notString)).toThrow(DomainError);
    expect(() => new ThreadId('')).toThrow('ID must be non-empty string');
  });
});

describe('Thread Entity', () => {
  const id = new ThreadId('thread-123');
  const ownerId = new UserId('user-123');
  const title = 'Sebuah thread';
  const body = 'Isi thread';
  const creationDate = new Date();

  describe('create', () => {
    it('should create instance with valid data', () => {
      const thread = Thread.create(id, ownerId, title, body, creationDate);

      expect(thread.id).toStrictEqual(id);
      expect(thread.ownerId).toStrictEqual(ownerId);
      expect(thread.title).toBe(title);
      expect(thread.body).toBe(body);
      expect(thread.createdAt).toStrictEqual(creationDate);
    });

    it('should provide default value creation date', () => {
      const thread = Thread.create(id, ownerId, title, body);

      const timeDiff = Math.abs(Date.now() - thread.createdAt.getTime());
      expect(timeDiff < 10000).toBe(true);
    });

    it('should throw DomainError when title more than 255 character', () => {
      try {
        Thread.create(id, ownerId, 'a'.repeat(256), body);
      } catch (error) {
        expect(error).toBeInstanceOf(DomainError);
        expect(error.message).toBe('Title max 255 character');
        expect(error.code).toBe('THREAD_INVALID_TITLE');
      }
    });
  });
});
