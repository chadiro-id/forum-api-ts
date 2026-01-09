import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { RepliesController } from './replies.controller';
import {
  AddReplyCommandHandlerProvider,
  DeleteReplyCommandHandlerProvider,
} from './replies.provider';

@Module({
  providers: [
    AddReplyCommandHandlerProvider,
    DeleteReplyCommandHandlerProvider,
  ],
  controllers: [RepliesController],
})
export class RepliesModule {}
