import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

export type Provider = ethers.providers.BaseProvider;

export const useNetworkProvider = () => {
  const [{ data }] = useNetwork();

  const { pathname, query } = useRouter();

  let chainId = data?.chain?.id ?? null;

  let name: string | null = data?.chain?.name ?? null;

  if (pathname === '/streams' && !Number.isNaN(query.chainId)) {
    chainId = Number(query.chainId);
    name = networkDetails[chainId]?.blockExplorerName;
  }

  const chainDetails = chainId && networkDetails[chainId];

  return {
    provider: chainDetails ? chainDetails.chainProviders : null,
    network: name,
    chainId,
    nativeCurrency: data.chain?.nativeCurrency,
    unsupported: data.chain?.unsupported,
    tokenListId: networkDetails[chainId ?? 0]?.tokenListId,
  };
};
