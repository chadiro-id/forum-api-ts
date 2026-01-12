import { AuthenticationData } from './database/pg-tables/authentications-table';
import { CommentData } from './database/pg-tables/comments-table';
import { ReplyData } from './database/pg-tables/replies-table';
import { ThreadData } from './database/pg-tables/threads-table';
import { UserData } from './database/pg-tables/users-table';

export function createUserData(overrides: Partial<UserData> = {}): UserData {
  const date = new Date();
  return {
    id: 'user-001',
    username: 'johndoe',
    password: 'p455w0rd',
    fullname: 'John Doe',
    created_at: date,
    ...overrides,
  };
}

export function createAuthenticationData(
  overrides: Partial<AuthenticationData> = {},
): AuthenticationData {
  return {
    id: '1',
    user_id: 'user-001',
    token: 'refresh_token',
    ...overrides,
  };
}

export function createThreadData(
  overrides: Partial<ThreadData> = {},
): ThreadData {
  const date = new Date();
  return {
    id: 'thread-002',
    owner_id: 'user-001',
    title: 'Sebuah thread',
    body: 'Isi thread',
    created_at: date,
    ...overrides,
  };
}

export function createCommentData(
  overrides: Partial<CommentData> = {},
): CommentData {
  const date = new Date();
  return {
    id: 'comment-003',
    thread_id: 'thread-002',
    owner_id: 'user-001',
    content: 'Sebuah komentar',
    is_delete: false,
    created_at: date,
    ...overrides,
  };
}

export function createReplyData(overrides: Partial<ReplyData> = {}): ReplyData {
  const date = new Date();
  return {
    id: 'reply-004',
    comment_id: 'comment-003',
    owner_id: 'user-001',
    content: 'Sebuah balasan',
    is_delete: false,
    created_at: date,
    ...overrides,
  };
}
