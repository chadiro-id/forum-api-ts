import { ThreadId } from '@main/domain/threads/entities/thread';
import { GetThreadDetailsQuery } from './get-thread-details.query';

describe('GetThreadDetailsQuery', () => {
  it('should correctly initialize data', () => {
    const query = new GetThreadDetailsQuery('thread-id');
    expect(query.id).toStrictEqual(new ThreadId('thread-id'));
  });
});
