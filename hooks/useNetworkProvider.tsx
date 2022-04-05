import { ethers } from 'ethers';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';
export type Provider = ethers.providers.BaseProvider;

export const useNetworkProvider = () => {
  const [{ data }] = useNetwork();

  const chainId = data?.chain?.id ?? null;
  const name: string | null = data?.chain?.name ?? null;

  const chainDetails = chainId && networkDetails[chainId];

  return { provider: chainDetails ? chainDetails.rpcProvider : undefined, network: name || '', chainId };
};
