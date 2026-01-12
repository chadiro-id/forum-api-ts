import { userRepositoryContract } from '../../../../domain/repositories/user-repository.contract';
import { InMemoryUserRepository } from './in-memory-user-repository';

describe('InMemoryUserRepository', () => {
  const contract = userRepositoryContract(InMemoryUserRepository);
  contract.testBehavior();
});
