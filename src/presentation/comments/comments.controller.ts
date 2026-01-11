import { DeleteCommentCommandHandler } from '../../application/comments/command/handler/delete-comment.command-handler';
import { AddCommentCommandHandler } from '../../application/comments/command/handler/add-comment.command-handler';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  User,
} from '../../libs/my-app/common/controllers/controllers.decorator';
import { UseGuards } from '../../libs/my-app/common/guards/guards.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AddCommentCommand } from '../../application/comments/command/add-comment.command';
import { ThreadId } from '../../domain/entities/thread';
import { UserId } from '../../domain/entities/user';
import { DeleteCommentCommand } from '../../application/comments/command/delete-comment.command';
import { CommentId } from '../../domain/entities/comment';
import { IdConverter } from '../shared/pipes/id-converter.pipe';
import { AddCommentDto } from './dtos/add-comment.dto';

@UseGuards(AuthGuard)
@Controller('/threads/:threadId/comments')
export class CommentsController {
  constructor(
    private addCommentCommandHandler: AddCommentCommandHandler,
    private deleteCommentCommandHandler: DeleteCommentCommandHandler,
  ) {}

  @HttpCode(201)
  @Post()
  async addComment(
    @Param('threadId', IdConverter) threadId: ThreadId,
    @Body() dto: AddCommentDto,
    @User('id', IdConverter) userId: UserId,
  ) {
    const command = new AddCommentCommand(threadId, userId, dto.content);
    const addedComment = await this.addCommentCommandHandler.handle(command);

    return { addedComment };
  }

  @Delete('/:id')
  async deleteComment(
    @Param('id', IdConverter) id: CommentId,
    @Param('threadId', IdConverter) threadId: ThreadId,
    @User('id', IdConverter) userId: UserId,
  ) {
    const command = new DeleteCommentCommand(id, threadId, userId);

    await this.deleteCommentCommandHandler.handle(command);
  }
}
