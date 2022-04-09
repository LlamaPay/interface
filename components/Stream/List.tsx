import * as React from 'react';
import FallbackList from 'components/FallbackList';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { ListItem } from './ListItem';

export const List = () => {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  return (
    <section className="min-h-[44px] w-full">
      <h1 className="mb-1 text-xl">Streams</h1>

      {isLoading || !streamsAndHistory.streams || error ? (
        <FallbackList
          isLoading={isLoading}
          data={streamsAndHistory.streams}
          error={error}
          noDataText="No streams yet"
        />
      ) : (
        <ul className="isolate flex flex-col space-y-4 rounded border p-2 dark:border-stone-700 ">
          {streamsAndHistory.streams?.map((stream) => (
            <ListItem key={stream.streamId} data={stream} />
          ))}
        </ul>
      )}
    </section>
  );
};
