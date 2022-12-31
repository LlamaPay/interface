import { useRouter } from 'next/router';
import * as React from 'react';
import { networkDetails } from '~/lib/networkDetails';
import { chains } from '~/lib/chains';
import { useNetwork } from 'wagmi';

export const useChainExplorer = () => {
  const [{ data: network }] = useNetwork();
  const { pathname, query } = useRouter();

  const { name, url, id } = React.useMemo(() => {
    if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
      const details = networkDetails[Number(query.chainId)];

      return details
        ? { name: details.blockExplorerName, url: details.blockExplorerURL?.slice(0, -1) ?? null }
        : { name: null, url: null };
    }

    if (
      pathname === '/salaries/[chain]/[address]' ||
      pathname === '/vesting/[chain]/[address]' ||
      pathname === '/yearn'
    ) {
      const chainParam = pathname === '/yearn' ? 'ethereum' : query.chain;

      const isParamChainId = Number.isNaN(Number(chainParam));

      let chain = null;

      // handle routes like /salaries/ethereum/0x1234... & /salaries/1/0x1234
      if (isParamChainId) {
        chain = typeof chainParam === 'string' && chains.find((c) => c.name.toLowerCase() === chainParam.toLowerCase());
      } else {
        chain = typeof chainParam === 'string' && chains.find((c) => c.id === Number(chainParam));
      }

      const details = chain && networkDetails[chain.id];

      return details
        ? { name: details.blockExplorerName, url: details.blockExplorerURL?.slice(0, -1) ?? null }
        : { name: null, url: null };
    }

    const explorers = network?.chain?.blockExplorers;

    return {
      name: explorers ? explorers[0]?.name ?? null : null,
      url: explorers ? explorers[0]?.url ?? null : null,
      id: network ? network.chain?.id ?? null : null,
    };
  }, [network, pathname, query]);

  return { name, url, id };
};
