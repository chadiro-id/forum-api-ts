import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { AuthController } from './auth.controller';
import {
  UserLoginCommandHandlerProvider,
  UserLogoutCommandHandlerProvider,
  RefreshAuthCommandHandlerProvider,
} from './auth.provider';

@Module({
  providers: [
    UserLoginCommandHandlerProvider,
    UserLogoutCommandHandlerProvider,
    RefreshAuthCommandHandlerProvider,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
