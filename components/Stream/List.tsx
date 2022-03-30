import * as React from 'react';
import FallbackList from 'components/FallbackList';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { useAccount } from 'wagmi';
import { ListItem } from './ListItem';

export const List = () => {
  const [{ data: accountData }] = useAccount();
  const { data, error, isLoading } = useStreamAndHistoryQuery({
    id: accountData?.address.toLowerCase() ?? '',
  });

  const streams = React.useMemo(() => {
    return data?.user?.streams ?? null;
  }, [data]);

  return (
    <section className="min-h-[44px] w-full max-w-lg">
      <h1 className="mb-3 text-center text-xl">Streams</h1>

      {isLoading || !streams || error ? (
        <FallbackList isLoading={isLoading} data={streams} error={error} noDataText="No streams yet" />
      ) : (
        <ul className="isolate flex flex-col space-y-4 rounded border p-2">
          {streams.map((stream) => (stream.active ? <ListItem key={stream.streamId} data={stream} /> : ''))}
        </ul>
      )}
    </section>
  );
};
