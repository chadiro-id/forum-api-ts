import {
  Authentication,
  AuthenticationId,
} from '@main/domain/authentications/entities/authentication';
import { Comment, CommentId } from '@main/domain/comments/entities/comment';
import { Reply, ReplyId } from '@main/domain/replies/entities/reply';
import { Thread, ThreadId } from '@main/domain/threads/entities/thread';
import { User, UserId } from '@main/domain/users/entities/user';

export const createUserEntity = (id: string) => {
  return User.create(
    new UserId(id),
    'johndoe',
    'p455w0rd',
    'John Doe',
    new Date(),
  );
};

export const createAuthEntity = (id: number, userId: string) => {
  return Authentication.restore(
    new AuthenticationId(id),
    new UserId(userId),
    'refresh_token',
  );
};

export const createThreadEntity = (id: string, userId: string) => {
  return Thread.create(
    new ThreadId(id),
    new UserId(userId),
    'Sebuah thread',
    'Isi thread',
    new Date(),
  );
};

export const createCommentEntity = (
  id: string,
  threadId: string,
  userId: string,
) => {
  return Comment.create(
    new CommentId(id),
    new ThreadId(threadId),
    new UserId(userId),
    'Sebuah komentar',
    false,
    new Date(),
  );
};

export const createReplyEntity = (
  id: string,
  threadId: string,
  commentId: string,
  userId: string,
) => {
  return Reply.create(
    new ReplyId(id),
    new ThreadId(threadId),
    new CommentId(commentId),
    new UserId(userId),
    'Sebuah balasan',
    false,
    new Date(),
  );
};
