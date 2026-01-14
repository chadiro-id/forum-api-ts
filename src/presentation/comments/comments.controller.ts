import { DeleteCommentCommandHandler } from '../../application/comments/command/handler/delete-comment.command-handler';
import { AddCommentCommandHandler } from '../../application/comments/command/handler/add-comment.command-handler';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  User,
} from '../../libs/my-app/common/controllers/controllers.decorator';
import { UseGuards } from '../../libs/my-app/common/guards/guards.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AddCommentCommand } from '../../application/comments/command/add-comment.command';
import { DeleteCommentCommand } from '../../application/comments/command/delete-comment.command';
import { AddCommentDto } from './dtos/add-comment.dto';
import { LikeCommentCommandHandler } from '@main/application/comments/command/handler/like-comment.command-handler';
import { LikeCommentCommand } from '@main/application/comments/command/like-comment.command';

@UseGuards(AuthGuard)
@Controller('/threads/:threadId/comments')
export class CommentsController {
  constructor(
    private addCommentCommandHandler: AddCommentCommandHandler,
    private deleteCommentCommandHandler: DeleteCommentCommandHandler,
    private likeCommentCommandHandler: LikeCommentCommandHandler,
  ) {}

  @HttpCode(201)
  @Post()
  async addComment(
    @Param('threadId') threadId: string,
    @Body() dto: AddCommentDto,
    @User('id') userId: string,
  ) {
    const command = new AddCommentCommand(threadId, userId, dto.content);
    const addedComment = await this.addCommentCommandHandler.handle(command);

    return { addedComment };
  }

  @Delete('/:id')
  async deleteComment(
    @Param('id') id: string,
    @Param('threadId') threadId: string,
    @User('id') userId: string,
  ) {
    const command = new DeleteCommentCommand(id, threadId, userId);
    await this.deleteCommentCommandHandler.handle(command);
  }

  @Put('/:id/likes')
  async likeComment(
    @Param('id') id: string,
    @Param('threadId') threadId: string,
    @User('id') userId: string,
  ) {
    const command = new LikeCommentCommand(id, threadId, userId);
    await this.likeCommentCommandHandler.handle(command);
  }
}
