import { PG_POOL } from '@main/infrastructure/database/database.module';
import { createUserData } from '@test/helper/data-factory';
import pgTest from '@test/helper/database/postgres-test.helper';
import { createServerTest, ServerTest } from '@test/helper/server-test.helper';
import { Pool } from 'pg';

let serverTest: ServerTest;

beforeAll(async () => {
  serverTest = createServerTest();
  serverTest.init();

  const pool = serverTest.getResolvedInstance<Pool>(PG_POOL);
  pgTest.setup(pool);

  await pgTest.truncate();
});

afterAll(async () => {
  await pgTest.end();
});

describe('Users Endpoint', () => {
  afterEach(async () => {
    await pgTest.users().cleanup();
  });

  describe('POST /users', () => {
    const registerUserPayload = {
      username: 'johndoe',
      password: 'p455w0rd',
      fullname: 'John Doe',
    };

    it('should response 201 and registered user data', async () => {
      const expectedResBody = {
        status: 'success',
        data: {
          addedUser: {
            id: expect.stringMatching(/^[A-Za-z0-9_-]{21}$/),
            username: registerUserPayload.username,
            fullname: registerUserPayload.fullname,
          },
        },
      };

      const payload = { ...registerUserPayload };
      const response = await serverTest.request().post('/users').send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toStrictEqual(expectedResBody);
    });

    it('should response 400 when username not available', async () => {
      const userData = createUserData({ username: 'johndoe' });
      await pgTest.users().add(userData);

      const payload = { ...registerUserPayload };
      const response = await serverTest.request().post('/users').send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'username tidak tersedia',
      });
    });

    it('should response 400 when payload not contain needed property', async () => {
      const payload = {
        username: 'johndoe',
        password: 'p455w0rd',
      };

      const response = await serverTest.request().post('/users').send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: '"fullname" wajib diisi',
      });
    });

    it('should response 400 when payload not meet data type specification', async () => {
      const payload = { ...registerUserPayload, username: 1234 };

      const response = await serverTest.request().post('/users').send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'username harus berupa teks',
      });
    });

    it('should response 400 when username contain more than 50 character', async () => {
      const payload = { ...registerUserPayload, username: 'a'.repeat(51) };

      const response = await serverTest.request().post('/users').send(payload);
      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message: 'username maksimal 50 karakter',
      });
    });

    it('should response 400 when username contain restricted character', async () => {
      const payload = { ...registerUserPayload, username: 'john^doe' };

      const response = await serverTest.request().post('/users').send(payload);
      expect(response.statusCode).toBe(400);
      expect(response.body).toStrictEqual({
        status: 'fail',
        message:
          'tidak dapat membuat user baru karena username mengandung karakter terlarang',
      });
    });
  });
});
