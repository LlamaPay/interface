import * as React from 'react';
import { useNetworkProvider } from '~/hooks';
import useGetSubgraphDelay from '~/queries/useGetSubgraphDelay';

export default function StaleSubgraphWarning() {
  const { data } = useGetSubgraphDelay();
  const { network } = useNetworkProvider();

  if (!data || data?.timeDelay < 60) return null;

  return (
    <p className="font-exo bg-red-600 py-1 px-2 text-center text-sm font-light text-white">
      {`${network} subgraph is currently delayed by ${data.blockDelay} blocks (${(data.timeDelay / 60).toFixed(
        2
      )} minutes)`}
    </p>
  );
}
