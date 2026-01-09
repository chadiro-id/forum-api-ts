import { ThreadRepository } from '../../domain/repositories/thread-repository.interface';
import { AddThreadCommandHandler } from '../../application/threads/command/handler/add-thread.command-handler';
import { GetThreadDetailsQueryHandler } from '../../application/threads/query/handler/get-thread-details.query-handler';
import {
  ID_GENERATOR,
  THREAD_REPOSITORY,
  THREAD_DETAILS_QUERY_SERVICE,
} from '../../shared/injections.constant';
import { ThreadDetailsQueryService } from '../../application/threads/interfaces/thread-details-query-service.interface';

export const AddThreadCommandHandlerProvider = {
  provide: AddThreadCommandHandler,
  useFactory: (threadRepo: ThreadRepository, idGenerator: () => string) =>
    new AddThreadCommandHandler(threadRepo, idGenerator),
  inject: [THREAD_REPOSITORY, ID_GENERATOR],
};

export const GetThreadDetailsQueryHandlerProvider = {
  provide: GetThreadDetailsQueryHandler,
  useFactory: (threadDetailsQueryService: ThreadDetailsQueryService) =>
    new GetThreadDetailsQueryHandler(threadDetailsQueryService),
  inject: [THREAD_DETAILS_QUERY_SERVICE],
};
