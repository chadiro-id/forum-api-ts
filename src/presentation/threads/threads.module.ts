import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import {
  AddThreadCommandHandlerProvider,
  GetThreadDetailsQueryHandlerProvider,
} from './threads.provider';
import { ThreadsController } from './threads.controller';

@Module({
  providers: [
    AddThreadCommandHandlerProvider,
    GetThreadDetailsQueryHandlerProvider,
  ],
  controllers: [ThreadsController],
})
export class ThreadsModule {}
