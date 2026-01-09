import { ConfigModule } from './infrastructure/config/config.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { Module } from './libs/my-app/common/modules/modules.decorator';
import { AuthModule } from './presentation/auth/auth.module';
import { CommentsModule } from './presentation/comments/comments.module';
import { RepliesModule } from './presentation/replies/replies.module';
import { ThreadsModule } from './presentation/threads/threads.module';
import { UsersModule } from './presentation/users/users.module';

@Module({
  imports: [
    ConfigModule,
    InfrastructureModule,
    AuthModule,
    UsersModule,
    ThreadsModule,
    CommentsModule,
    RepliesModule,
  ],
})
export class AppModule {}
