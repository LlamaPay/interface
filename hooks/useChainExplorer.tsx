import { useRouter } from 'next/router';
import * as React from 'react';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

export const useChainExplorer = () => {
  const [{ data: network }] = useNetwork();
  const { pathname, query } = useRouter();

  const { name, url } = React.useMemo(() => {
    if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
      const details = networkDetails[Number(query.chainId)];

      return details
        ? { name: details.blockExplorerName, url: details.blockExplorerURL?.slice(0, -1) ?? null }
        : { name: null, url: null };
    }

    const explorers = network?.chain?.blockExplorers;
    return { name: explorers ? explorers[0]?.name ?? null : null, url: explorers ? explorers[0]?.url ?? null : null };
  }, [network, pathname, query.chainId]);

  return { name, url };
};
