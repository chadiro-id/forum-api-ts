import { DomainError } from '../common/domain-error';
import { AccessRightsError } from './access-rights.error';

describe('AccessRightsError', () => {
  it('should be instance of DomainError', () => {
    const error = new AccessRightsError();
    expect(error).toBeInstanceOf(DomainError);
  });

  it('should correctly initialize properties', () => {
    const error = new AccessRightsError('Test message', 'ACCESS_RIGHTS_CODE');

    expect(error.name).toBe('AccessRightsError');
    expect(error.message).toBe('Test message');
    expect(error.code).toBe('ACCESS_RIGHTS_CODE');
  });
});
