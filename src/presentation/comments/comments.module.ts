import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { CommentsController } from './comments.controller';
import {
  AddCommentCommandHandlerProvider,
  DeleteCommentCommandHandlerProvider,
} from './comments.provider';

@Module({
  providers: [
    AddCommentCommandHandlerProvider,
    DeleteCommentCommandHandlerProvider,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
