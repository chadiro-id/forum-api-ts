import { Authentication } from '@main/domain/authentications/entities/authentication';
import { UserId } from '@main/domain/users/entities/user';
import { ConfigModule } from '@main/infrastructure/config/config.module';
import {
  DatabaseModule,
  PG_POOL,
} from '@main/infrastructure/database/database.module';
import { AuthenticationMapper } from '@main/infrastructure/persistence/mappers/authentication.mapper';
import { PostgresAuthenticationRepository } from '@main/infrastructure/persistence/repositories/postgres-authentication.repository';
import Test from '@main/libs/my-app/testing/test-utils';
import { createUserData } from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { Pool } from 'pg';

let authRepo: PostgresAuthenticationRepository;

beforeAll(async () => {
  const moduleRef = Test.createTestingModule({
    imports: [ConfigModule, DatabaseModule],
    providers: [
      {
        provide: PostgresAuthenticationRepository,
        useClass: PostgresAuthenticationRepository,
      },
    ],
  });
  const pool = moduleRef.resolve<Pool>(PG_POOL);

  authRepo = moduleRef.resolve(PostgresAuthenticationRepository);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('PostgresAuthenticationRepository', () => {
  const userData = createUserData();

  beforeAll(async () => {
    await pgTest.users().add(userData);
  });

  afterAll(async () => {
    await pgTest.users().cleanup();
  });

  afterEach(async () => {
    await pgTest.authentications().cleanup();
  });

  describe('add', () => {
    it('should persist Authentication data and return AuthenticationId', async () => {
      const authentication = Authentication.create(
        new UserId(userData.id),
        'refresh_token',
      );

      const id = await authRepo.add(authentication);
      expect(id.value > 0).toBe(true);

      const authentications = await pgTest.authentications().findById(id.value);
      expect(authentications).toStrictEqual([
        {
          id: id.value,
          user_id: authentication.userId.value,
          token: authentication.token,
        },
      ]);
    });
  });

  describe('findByToken', () => {
    it('should return Authentication entity', async () => {
      const persistedAuth = await pgTest
        .authentications()
        .add({ user_id: userData.id, token: 'refresh_token' });

      const expectedResult = AuthenticationMapper.toDomain(persistedAuth);

      const result = await authRepo.findByToken('refresh_token');
      expect(result).toStrictEqual(expectedResult);
    });

    it('should return null when token not exists', async () => {
      const result = await authRepo.findByToken('non-existence-token');
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete authentication data', async () => {
      const persistedAuth = await pgTest
        .authentications()
        .add({ user_id: userData.id, token: 'refresh_token' });

      const authentication = AuthenticationMapper.toDomain(persistedAuth);
      await authRepo.delete(authentication);

      const result = await pgTest
        .authentications()
        .findById(authentication.id.value);

      expect(result).toStrictEqual([]);
    });
  });
});
