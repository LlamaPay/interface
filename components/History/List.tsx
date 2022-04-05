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

  const history = React.useMemo(() => {
    return data?.user?.historicalEvents ?? null;
  }, [data]);

  return (
    <section className="min-h-[44px] w-full">
      <h1 className="mb-3 text-center text-xl">History</h1>
      {isLoading || !history || error ? (
        <FallbackList isLoading={isLoading} data={history} error={error} noDataText="No history yet" />
      ) : (
        <ul className="isolate flex flex-col space-y-4 rounded border p-2">
          {history?.map((historyEvent) => (
            <ListItem key={historyEvent.txHash} data={historyEvent} />
          ))}
        </ul>
      )}
    </section>
  );
};
