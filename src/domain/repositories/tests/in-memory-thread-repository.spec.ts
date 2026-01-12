import { userRepositoryContract } from '../user-repository.contract';
import { InMemoryThreadRepository } from './in-memory-thread-repository';

describe('InMemoryThreadRepository', () => {
  const contract = userRepositoryContract(InMemoryThreadRepository);
  contract.testBehavior();
});
