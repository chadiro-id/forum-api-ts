import { createServerTest } from '@test/helper/server-test.helper';

describe('HTTP Server', () => {
  it('should response 404 for unregistered routes', async () => {
    const serverTest = createServerTest();
    serverTest.init();

    const response = await serverTest.request().get('/unregistered-routes');

    expect(response.status).toBe(404);
    expect(response.body).toStrictEqual({
      statusCode: 404,
      message: 'Cannot GET /unregistered-routes',
      timestamp: expect.stringMatching(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/,
      ),
    });
  });

  it('should handle server error correctly', async () => {
    const serverTest = createServerTest();
    serverTest.init();

    const response = await serverTest.request().get('/error');

    expect(response.status).toBe(500);
    expect(response.body).toStrictEqual({
      status: 'fail',
      message: 'terjadi kegagalan pada server kami',
    });
  });
});
