import { Reply } from '../../../domain/replies/reply';

export class AddedReplyReport {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly owner: string,
  ) {}

  static fromEntity(reply: Reply) {
    return new AddedReplyReport(
      reply.id.value,
      reply.content,
      reply.ownerId.value,
    );
  }
}
