import { Thread, ThreadId } from '../entities/thread';
import { UserId } from '../entities/user';

export function userRepositoryContract<T extends new (...args: any[]) => any>(
  RepoClass: T,
  ...params: ConstructorParameters<T>
) {
  return {
    createInstance: () => {
      return new RepoClass(...params);
    },

    testBehavior: () => {
      describe('UserRepository Behavior', () => {
        it('should implement method correctly', () => {
          const instance = new RepoClass(...params);

          expect(typeof instance['add']).toBe('function');
          expect(typeof instance['existsById']).toBe('function');
        });

        it('should enforce add method', async () => {
          const id = new ThreadId('thread-001');
          const ownerId = new UserId('user-002');
          const title = 'Sebuah thread';
          const body = 'Isi thread';
          const thread = Thread.create(id, ownerId, title, body);

          const repo = new RepoClass(...params);
          await repo.add(thread);

          const persistedThread = await repo.existsById(id);
          expect(persistedThread).toBe(true);
        });
      });
    },
  };
}
