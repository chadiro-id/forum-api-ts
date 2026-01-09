import { DomainError } from '../common/domain-error';
import { Thread, ThreadId } from './thread';
import { UserId } from './user';

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

  describe('constructor', () => {
    it('should create instance with valid data', () => {
      const thread = new Thread(id, ownerId, title, body, creationDate);

      expect(thread.id).toStrictEqual(id);
      expect(thread.ownerId).toStrictEqual(ownerId);
      expect(thread.title).toBe(title);
      expect(thread.body).toBe(body);
      expect(thread.createdAt).toStrictEqual(creationDate);
    });
  });
});
