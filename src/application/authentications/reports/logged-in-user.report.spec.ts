import { LoggedInUserReport } from './logged-in-user.report';

describe('LoggedInUserReport', () => {
  it('should initialize with valid data', () => {
    const report = new LoggedInUserReport('access_token', 'refresh_token');

    expect(report.accessToken).toBe('access_token');
    expect(report.refreshToken).toBe('refresh_token');

    expect(Object.keys(report)).toHaveLength(2);
  });
});
