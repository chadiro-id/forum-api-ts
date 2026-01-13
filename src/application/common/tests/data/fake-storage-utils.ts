import { DomainEntity, EntityId } from '@main/domain/common/domain-entity';

export type StorageKey =
  | 'users'
  | 'authentications'
  | 'threads'
  | 'comments'
  | 'replies';

export type FakeStorage = Map<
  StorageKey,
  DomainEntity<EntityId<string | number>>[]
>;

export function createFakeStorage() {
  const storage: FakeStorage = new Map();

  storage
    .set('users', [])
    .set('authentications', [])
    .set('threads', [])
    .set('comments', [])
    .set('replies', []);

  return storage;
}
