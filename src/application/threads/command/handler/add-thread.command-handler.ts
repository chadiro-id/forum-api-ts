import { Thread, ThreadId } from '../../../../domain/threads/entities/thread';
import { ThreadRepository } from '../../../../domain/threads/thread-repository.interface';
import { AddedThreadReport } from '../../reports/added-thread.report';
import { AddThreadCommand } from '../add-thread.command';

export class AddThreadCommandHandler {
  constructor(
    private threadRepository: ThreadRepository,
    private idGenerator: () => string,
  ) {}

  async handle(command: AddThreadCommand): Promise<AddedThreadReport> {
    const { title, body, userId } = command;

    const id = new ThreadId(this.idGenerator());
    const thread = Thread.create(id, userId, title, body);

    await this.threadRepository.add(thread);

    return AddedThreadReport.fromEntity(thread);
  }
}
