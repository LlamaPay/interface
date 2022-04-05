import * as React from 'react';
import FallbackList from 'components/FallbackList';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { useAccount, useNetwork } from 'wagmi';
import { ListItem } from './ListItem';
import { useGraphEndpoint } from 'hooks';

export const List = () => {
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  // get subgraph endpoint
  const endpoint = useGraphEndpoint();

  const { data, error, isLoading } = useStreamAndHistoryQuery(
    {
      endpoint,
    },
    {
      id: accountData?.address.toLowerCase() ?? '',
      network: networkData?.chain?.name ?? '',
    }
  );

  const streams = React.useMemo(() => {
    const streams = data?.user?.streams ?? [];
    const activeStreams = streams.filter((s) => s.active);
    return activeStreams.length > 0 ? activeStreams : null;
  }, [data]);

  return (
    <section className="min-h-[44px] w-full">
      <h1 className="mb-3 text-center text-xl">Streams</h1>

      {isLoading || !streams || error ? (
        <FallbackList isLoading={isLoading} data={streams} error={error} noDataText="No streams yet" />
      ) : (
        <ul className="isolate flex flex-col space-y-4 rounded border p-2 ">
          {streams.map((stream) => (
            <ListItem key={stream.streamId} data={stream} />
          ))}
        </ul>
      )}
    </section>
  );
};
