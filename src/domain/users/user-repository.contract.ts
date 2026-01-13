import { UserId, User } from './entities/user';
import { UserRepository } from './user-repository.interface';

export function userRepositoryContract<T extends new (...args: any[]) => any>(
  RepoClass: T,
  ...params: ConstructorParameters<T>
) {
  return {
    testBehavior: () => {
      describe('UserRepository Behavior', () => {
        it('should implement method correctly', async () => {
          const id = new UserId('user-001');
          const user = User.create(id, 'johndoe', 'p455w0rd', 'John Doe');

          const repo = new RepoClass(...params) as UserRepository;

          const nonExistsUser = await repo.findByUsername('johndoe');
          expect(nonExistsUser).toBe(null);
          const nonExists = await repo.existsByUsername('johndoe');
          expect(nonExists).toBe(false);

          await repo.add(user);

          const foundUser = await repo.findByUsername('johndoe');
          expect(foundUser).toStrictEqual(user);
          const exists = await repo.existsByUsername('johndoe');
          expect(exists).toBe(true);
        });
      });
    },
  };
}
