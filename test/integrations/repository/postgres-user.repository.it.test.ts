import { Pool } from 'pg';
import { AppModule } from '@main/app.module';
import { PG_POOL } from '@main/infrastructure/database/database.module';
import { USER_REPOSITORY } from '@main/shared/injections.constant';
import { PostgresUserRepository } from '@main/infrastructure/persistence/repositories/postgres-user.repository';
import { UserId, User } from '@main/domain/entities/user';
import Test from '@main/libs/my-app/testing/test-utils';
import pgTest from '@test/helper/database/postgres-test.helper';
import { createUserData } from '@test/helper/data-factory';

let userRepository: PostgresUserRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule(AppModule);
  const pool: Pool = moduleRef.resolve(PG_POOL);

  userRepository = moduleRef.resolve(USER_REPOSITORY);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('PostgresUserRepository', () => {
  afterEach(async () => {
    await pgTest.users().cleanup();
  });

  describe('add', () => {
    it('should persist User data', async () => {
      const id = new UserId('user-123');
      const user = User.create(id, 'johndoe', 'p455w0rd', 'John Doe');

      await userRepository.add(user);

      const users = await pgTest.users().findById('user-123');
      expect(users).toStrictEqual([
        {
          id: 'user-123',
          username: 'johndoe',
          password: 'p455w0rd',
          fullname: 'John Doe',
          created_at: expect.toBeRecentDate(),
        },
      ]);
    });
  });

  describe('findByUsername', () => {
    it('should return User entity', async () => {
      const userData = createUserData();
      const expectedUser = new User(
        new UserId(userData.id),
        userData.username,
        userData.password,
        userData.fullname,
        new Date(userData.created_at),
      );

      await pgTest.users().add(userData);

      const user = await userRepository.findByUsername('johndoe');
      expect(user).toStrictEqual(expectedUser);
    });

    it('should return null when username not exists', async () => {
      const user = await userRepository.findByUsername('johndoe');
      expect(user).toBeNull();
    });
  });

  describe('existsByUsername', () => {
    it('should return true when username exists', async () => {
      const userData = createUserData({ username: 'johndoe' });

      await pgTest.users().add(userData);

      const exists = await userRepository.existsByUsername('johndoe');
      expect(exists).toBe(true);
    });

    it('should return false when username not exists', async () => {
      const exists = await userRepository.existsByUsername('non-exists');
      expect(exists).toBe(false);
    });
  });
});
