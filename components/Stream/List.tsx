import * as React from 'react';
import FallbackList from 'components/FallbackList';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import { ListItem } from './ListItem';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/solid';

export const List = () => {
  const { data: streamsAndHistory, isLoading, error } = useStreamsAndHistory();

  return (
    <section className="min-h-[44px] w-full">
      <span className="mb-1 flex items-center justify-between">
        <h1 className="text-xl">Streams</h1>
        <Link href="/create" passHref>
          <button className="flex items-center space-x-2 whitespace-nowrap rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800">
            <PlusIcon className="h-4 w-4" />
            <span>Create</span>
          </button>
        </Link>
      </span>

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
