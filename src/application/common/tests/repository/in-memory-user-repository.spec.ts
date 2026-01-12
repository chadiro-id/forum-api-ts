import { userRepositoryContract } from '../../../../domain/users/user-repository.contract';
import { InMemoryUserRepository } from './in-memory-user-repository';

describe('InMemoryUserRepository', () => {
  const contract = userRepositoryContract(InMemoryUserRepository);
  contract.testBehavior();
});
