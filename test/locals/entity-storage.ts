import { DomainEntity, EntityId } from '@main/domain/common/domain-entity';

export type StorageKey =
  | 'users'
  | 'authentications'
  | 'threads'
  | 'comments'
  | 'comment_likes'
  | 'replies';

export type EntityStorage = Map<
  StorageKey,
  DomainEntity<EntityId<string | number>>[]
>;
