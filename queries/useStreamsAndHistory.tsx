import * as React from 'react';
import { useFormatStreamAndHistory, useGraphEndpoint, useNetworkProvider } from '~/hooks';
import { useStreamAndHistoryQuery } from '~/services/generated/graphql';
import { useAccount } from 'wagmi';

const useStreamsAndHistory = () => {
  const { address } = useAccount();
  const { provider, network } = useNetworkProvider();

  // get subgraph endpoint
  const endpoint = useGraphEndpoint();

  const { data, isLoading, error } = useStreamAndHistoryQuery(
    {
      endpoint,
    },
    {
      id: address?.toLowerCase() ?? '',
      network: network || '',
    },
    {
      refetchInterval: 30000,
    }
  );

  const formattedData = useFormatStreamAndHistory({ data, address: address, provider });

  return React.useMemo(() => ({ data: formattedData, isLoading, error }), [formattedData, isLoading, error]);
};

export default useStreamsAndHistory;
