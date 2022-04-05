import * as React from 'react';
import { useNetwork } from 'wagmi';

export const useChainExplorer = () => {
  const [{ data: network }] = useNetwork();

  const chainExplorer: string | null = React.useMemo(() => {
    const explorers = network?.chain?.blockExplorers;
    return explorers ? explorers[0]?.url ?? null : null;
  }, [network]);

  return chainExplorer;
};
