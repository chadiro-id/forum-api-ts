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
    @Param('threadId') threadId: string,
    @Param('commentId') commentId: string,
    @Body() dto: AddReplyDto,
    @User('id') userId: string,
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
    @Param('id') id: string,
    @Param('commentId') commentId: string,
    @Param('threadId') threadId: string,
    @User('id') userId: string,
  ) {
    const command = new DeleteReplyCommand(id, commentId, threadId, userId);
    await this.deleteReplyCommandHandler.handle(command);
  }
}
