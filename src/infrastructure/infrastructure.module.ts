import { Module } from '../libs/my-app/common/modules/modules.decorator';
import { JwtTokenService } from './security/jwt-token-service';
import { BcryptPasswordHasher } from './security/bcrypt-password-hasher';
import { PostgresAuthenticationRepository } from './persistence/repositories/postgres-authentication.repository';
import { PostgresUserRepository } from './persistence/repositories/postgres-user.repository';
import { PostgresThreadRepository } from './persistence/repositories/postgres-thread.repository';
import { PostgresCommentRepository } from './persistence/repositories/postgres-comment.repository';
import { PostgresReplyRepository } from './persistence/repositories/postgres-reply.repository';
import {
  ID_GENERATOR,
  PASSWORD_HASHER,
  AUTH_TOKEN_SERVICE,
  USER_REPOSITORY,
  AUTHENTICATION_REPOSITORY,
  THREAD_REPOSITORY,
  COMMENT_REPOSITORY,
  REPLY_REPOSITORY,
  THREAD_DETAILS_QUERY_SERVICE,
  COMMENT_LIKE_REPOSITORY,
} from '../shared/injections.constant';
import { nanoid } from 'nanoid';
import { DatabaseModule } from './database/database.module';
import { PostgresThreadDetailsQueryService } from './persistence/query-services/postgres-thread-details.query-service';
import { PostgresCommentLikeRepository } from './persistence/repositories/postgres-comment-like.repository';

@Module({
  providers: [
    {
      provide: ID_GENERATOR,
      useValue: nanoid,
    },
    {
      provide: PASSWORD_HASHER,
      useClass: BcryptPasswordHasher,
    },
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: JwtTokenService,
    },
    {
      provide: AUTHENTICATION_REPOSITORY,
      useClass: PostgresAuthenticationRepository,
    },
    {
      provide: USER_REPOSITORY,
      useClass: PostgresUserRepository,
    },
    {
      provide: THREAD_REPOSITORY,
      useClass: PostgresThreadRepository,
    },
    {
      provide: THREAD_DETAILS_QUERY_SERVICE,
      useClass: PostgresThreadDetailsQueryService,
    },
    {
      provide: COMMENT_REPOSITORY,
      useClass: PostgresCommentRepository,
    },
    {
      provide: COMMENT_LIKE_REPOSITORY,
      useClass: PostgresCommentLikeRepository,
    },
    {
      provide: REPLY_REPOSITORY,
      useClass: PostgresReplyRepository,
    },
  ],
  imports: [DatabaseModule],
})
export class InfrastructureModule {}
