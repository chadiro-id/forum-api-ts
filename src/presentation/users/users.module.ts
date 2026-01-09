import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { UsersController } from './users.controller';
import { RegisterUserCommandHandlerProvider } from './users.provider';

@Module({
  providers: [RegisterUserCommandHandlerProvider],
  controllers: [UsersController],
})
export class UsersModule {}
