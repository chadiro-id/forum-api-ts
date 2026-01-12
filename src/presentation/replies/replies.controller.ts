import { UseGuards } from '../../libs/my-app/common/guards/guards.decorator';
import { AddReplyCommandHandler } from '../../application/replies/command/handler/add-reply.command-handler';
import { DeleteReplyCommandHandler } from '../../application/replies/command/handler/delete-reply.command-handler';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  User,
} from '../../libs/my-app/common/controllers/controllers.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AddReplyCommand } from '../../application/replies/command/add-reply.command';
import { DeleteReplyCommand } from '../../application/replies/command/delete-reply.command';
import { ReplyId } from '../../domain/entities/reply';
import { CommentId } from '../../domain/comments/comment';
import { ThreadId } from '../../domain/entities/thread';
import { UserId } from '../../domain/entities/user';
import { IdConverter } from '../shared/pipes/id-converter.pipe';
import { AddReplyDto } from './dtos/add-reply.dto';

@UseGuards(AuthGuard)
@Controller('/threads/:threadId/comments/:commentId/replies')
export class RepliesController {
  constructor(
    private addReplyCommandHandler: AddReplyCommandHandler,
    private deleteReplyCommandHandler: DeleteReplyCommandHandler,
  ) {}

  @HttpCode(201)
  @Post()
  async addReply(
    @Param('threadId', IdConverter) threadId: ThreadId,
    @Param('commentId', IdConverter) commentId: CommentId,
    @Body() dto: AddReplyDto,
    @User('id', IdConverter) userId: UserId,
  ) {
    const command = new AddReplyCommand(
      threadId,
      commentId,
      userId,
      dto.content,
    );
    const addedReply = await this.addReplyCommandHandler.handle(command);

    return { addedReply };
  }

  @Delete('/:id')
  async deleteReply(
    @Param('id', IdConverter) id: ReplyId,
    @Param('commentId', IdConverter) commentId: CommentId,
    @Param('threadId', IdConverter) threadId: ThreadId,
    @User('id', IdConverter) userId: UserId,
  ) {
    const command = new DeleteReplyCommand(id, commentId, threadId, userId);
    await this.deleteReplyCommandHandler.handle(command);
  }
}
