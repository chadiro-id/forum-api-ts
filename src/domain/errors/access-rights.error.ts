import { DomainError } from '../common/domain-error';

export class AccessRightsError extends DomainError {
  constructor(message?: string, code?: string) {
    super(message, code);
    this.name = 'AccessRightsError';
  }
}
