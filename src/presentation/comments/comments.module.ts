import { Module } from '../../libs/my-app/common/modules/modules.decorator';
import { CommentsController } from './comments.controller';
import {
  AddCommentCommandHandlerProvider,
  DeleteCommentCommandHandlerProvider,
  LikeCommentCommandHandlerProvider,
} from './comments.provider';

@Module({
  providers: [
    AddCommentCommandHandlerProvider,
    DeleteCommentCommandHandlerProvider,
    LikeCommentCommandHandlerProvider,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
