import * as React from 'react';
import { useNetwork } from 'wagmi';

export const useChainExplorer = () => {
  const [{ data: network }] = useNetwork();

  const { name, url } = React.useMemo(() => {
    const explorers = network?.chain?.blockExplorers;
    return { name: explorers ? explorers[0]?.name ?? null : null, url: explorers ? explorers[0]?.url ?? null : null };
  }, [network]);

  return { name, url };
};
