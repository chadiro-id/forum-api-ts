import { ThreadDetailsQueryService } from '../../interfaces/thread-details-query-service.interface';
import { GetThreadDetailsQueryHandler } from './get-thread-details.query-handler';
import {
  CommentDetails,
  ReplyDetails,
  ThreadDetails,
} from '../results/thread-details.result';
import { ThreadId } from '@main/domain/threads/entities/thread';
import { CommentId } from '@main/domain/comments/entities/comment';
import { ReplyId } from '@main/domain/replies/entities/reply';
import { GetThreadDetailsQuery } from '../get-thread-details.query';
import { ThreadDetailsReport } from '../../reports/thread-details.report';
import { ThreadNotFoundError } from '../../errors/thread-not-found.error';
import { MockThreadDetailsQueryService } from '../../interfaces/thread-details-query-service.mock';

jest.useFakeTimers();
describe('GetThreadDetailsQueryHandler', () => {
  let mockThreadDetailsQueryService: ThreadDetailsQueryService;
  let queryHandler: GetThreadDetailsQueryHandler;

  beforeAll(() => {
    mockThreadDetailsQueryService = new MockThreadDetailsQueryService();
    queryHandler = new GetThreadDetailsQueryHandler(
      mockThreadDetailsQueryService,
    );
  });

  it('should handle get thread details correctly', async () => {
    const mockValueThread = createThreadDetails('thread-001');
    const mockValueComments = [
      createCommentDetails('comment-001', true),
      createCommentDetails('comment-002', false),
    ];
    const mockValueReplies = [
      createReplyDetails('reply-001', 'comment-002', true),
      createReplyDetails('reply-002', 'comment-002', false),
    ];

    mockThreadDetailsQueryService.getById = jest
      .fn()
      .mockResolvedValue(mockValueThread);
    mockThreadDetailsQueryService.getCommentsById = jest
      .fn()
      .mockResolvedValue(mockValueComments);
    mockThreadDetailsQueryService.getRepliesByCommentIds = jest
      .fn()
      .mockResolvedValue(mockValueReplies);

    const expectedResult = ThreadDetailsReport.fromQuery(
      createThreadDetails('thread-001'),
      [
        createCommentDetails('comment-001', true),
        createCommentDetails('comment-002', false),
      ],
      [
        createReplyDetails('reply-001', 'comment-002', true),
        createReplyDetails('reply-002', 'comment-002', false),
      ],
    );

    const query = new GetThreadDetailsQuery('thread-001');
    const result = await queryHandler.handle(query);

    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadDetailsQueryService.getById).toHaveBeenCalledWith(
      query.id,
    );
    expect(mockThreadDetailsQueryService.getCommentsById).toHaveBeenCalledWith(
      query.id,
    );
    expect(
      mockThreadDetailsQueryService.getRepliesByCommentIds,
    ).toHaveBeenCalledWith([
      new CommentId('comment-001'),
      new CommentId('comment-002'),
    ]);
  });

  it('should handle thread with empty comments', async () => {
    const mockValueThread = createThreadDetails('thread-001');

    mockThreadDetailsQueryService.getById = jest
      .fn()
      .mockResolvedValue(mockValueThread);
    mockThreadDetailsQueryService.getCommentsById = jest
      .fn()
      .mockResolvedValue([]);
    mockThreadDetailsQueryService.getRepliesByCommentIds = jest.fn();

    const expectedResult = ThreadDetailsReport.fromQuery(
      createThreadDetails('thread-001'),
    );

    const query = new GetThreadDetailsQuery('thread-001');
    const result = await queryHandler.handle(query);

    expect(result).toStrictEqual(expectedResult);
    expect(mockThreadDetailsQueryService.getById).toHaveBeenCalledTimes(1);
    expect(mockThreadDetailsQueryService.getCommentsById).toHaveBeenCalledTimes(
      1,
    );
    expect(
      mockThreadDetailsQueryService.getRepliesByCommentIds,
    ).not.toHaveBeenCalled();
  });

  it('should throw error when thread not found', async () => {
    mockThreadDetailsQueryService.getById = jest.fn().mockResolvedValue(null);
    mockThreadDetailsQueryService.getCommentsById = jest.fn();
    mockThreadDetailsQueryService.getRepliesByCommentIds = jest.fn();

    const query = new GetThreadDetailsQuery('thread-001');
    await expect(queryHandler.handle(query)).rejects.toThrow(
      ThreadNotFoundError,
    );

    expect(
      mockThreadDetailsQueryService.getCommentsById,
    ).not.toHaveBeenCalled();
    expect(
      mockThreadDetailsQueryService.getRepliesByCommentIds,
    ).not.toHaveBeenCalled();
  });
});

const createThreadDetails = (id: string = 'thread-001') =>
  new ThreadDetails(
    new ThreadId(id),
    'Sebuah thread',
    'Isi thread',
    'johndoe',
    new Date(),
  );

const createCommentDetails = (
  id: string = 'comment-001',
  isDelete: boolean = false,
) =>
  new CommentDetails(
    new CommentId(id),
    'Sebuah komentar',
    'johndoe',
    isDelete,
    new Date(),
  );

const createReplyDetails = (
  id: string = 'reply-001',
  commentId: string = 'comment-001',
  isDelete: boolean = false,
) =>
  new ReplyDetails(
    new ReplyId(id),
    new CommentId(commentId),
    'johndoe',
    'Sebuah balasan',
    isDelete,
    new Date(),
  );
