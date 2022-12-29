import * as React from 'react';
import { useNetworkProvider } from 'hooks';
import { networkDetails } from 'lib/networkDetails';

export default function ExplorerLink({ value, query }: { value: React.ReactNode; query: string }) {
  const { chainId } = useNetworkProvider();

  const explorerUrl = chainId ? networkDetails[chainId].blockExplorerURL : '';

  return (
    <a
      href={chainId === 82 || chainId === 1088 ? `${explorerUrl}address/${query}` : `${explorerUrl}/address/${query}`}
      target="_blank"
      rel="noreferrer noopener"
      className="font-exo text-center dark:text-white"
    >
      {value}
    </a>
  );
}
