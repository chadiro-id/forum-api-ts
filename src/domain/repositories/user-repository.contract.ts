import { UserId, User } from '../entities/user';

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
        const repo = new RepoClass(...params);

        it('should implement method correctly', () => {
          const instance = new RepoClass(...params);

          expect(typeof instance['add']).toBe('function');
          expect(typeof instance['existsByUsername']).toBe('function');
        });

        it('should enforce add method', async () => {
          const id = new UserId('user-001');
          const user = User.create(id, 'johndoe', 'p455w0rd', 'John Doe');

          await repo.add(user);

          const exists = await repo.existsByUsername('johndoe');
          expect(exists).toBe(true);
        });
      });
    },
  };
}
