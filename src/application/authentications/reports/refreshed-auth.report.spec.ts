import { RefreshedAuthReport } from './refreshed-auth.report';

describe('RefreshedAuthReport', () => {
  const report = new RefreshedAuthReport('new_access_token');

  expect(report.accessToken).toBe('new_access_token');
  expect(Object.keys(report)).toHaveLength(1);
});
