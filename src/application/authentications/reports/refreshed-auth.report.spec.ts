import { RefreshedAuthReport } from './refreshed-auth.report';

describe('RefreshedAuthReport', () => {
  it('should correctly initialize data', () => {
    const report = new RefreshedAuthReport('new_access_token');

    expect(report.accessToken).toBe('new_access_token');
  });
});
