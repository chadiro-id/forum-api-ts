import { AddThreadCommandHandler } from '../../application/threads/command/handler/add-thread.command-handler';
import { GetThreadDetailsQueryHandler } from '../../application/threads/query/handler/get-thread-details.query-handler';
import { AddThreadDto } from './dtos/add-thread.dto';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  User,
} from '../../libs/my-app/common/controllers/controllers.decorator';
import { UseGuards } from '../../libs/my-app/common/guards/guards.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { AddThreadCommand } from '../../application/threads/command/add-thread.command';
import { UserId } from '../../domain/users/user';
import { IdConverter } from '../shared/pipes/id-converter.pipe';
import { GetThreadDetailsQuery } from '../../application/threads/query/get-thread-details.query';

@Controller('/threads')
export class ThreadsController {
  constructor(
    private addThreadCommandHandler: AddThreadCommandHandler,
    private getThreadDetailsQueryHandler: GetThreadDetailsQueryHandler,
  ) {}

  @UseGuards(AuthGuard)
  @HttpCode(201)
  @Post()
  async addThread(
    @Body() dto: AddThreadDto,
    @User('id', IdConverter) userId: UserId,
  ) {
    const command = new AddThreadCommand(dto.title, dto.body, userId);
    const addedThread = await this.addThreadCommandHandler.handle(command);

    return { addedThread };
  }

  @Get('/:id')
  async getThreadDetails(@Param('id') id: string) {
    const query = new GetThreadDetailsQuery(id);
    const thread = await this.getThreadDetailsQueryHandler.handle(query);

    return { thread };
  }
}
