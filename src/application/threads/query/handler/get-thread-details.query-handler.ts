import { ThreadNotFoundError } from '../../errors/thread-not-found.error';
import { ThreadDetailsReport } from '../../reports/thread-details.report';
import { GetThreadDetailsQuery } from '../get-thread-details.query';
import { ThreadDetailsQueryService } from '../../interfaces/thread-details-query-service.interface';

export class GetThreadDetailsQueryHandler {
  constructor(private threadDetailsQueryService: ThreadDetailsQueryService) {}

  async handle(query: GetThreadDetailsQuery): Promise<ThreadDetailsReport> {
    const thread = await this.threadDetailsQueryService.getById(query.id);
    if (!thread) {
      throw new ThreadNotFoundError();
    }

    const comments = await this.threadDetailsQueryService.getCommentsById(
      query.id,
    );
    if (comments.length === 0) {
      return ThreadDetailsReport.fromQuery(thread);
    }

    const commentIds = comments.map(({ id }) => id);
    const replies =
      await this.threadDetailsQueryService.getRepliesByCommentIds(commentIds);

    return ThreadDetailsReport.fromQuery(thread, comments, replies);
  }
}
