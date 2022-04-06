import { networkDetails, defaultSubgraphEndpoint } from 'utils/constants';
import { useNetwork } from 'wagmi';

export const useGraphEndpoint = () => {
  // get users network
  const [{ data }] = useNetwork();

  const chainId: number | null = data?.chain?.id ?? null;

  return chainId ? networkDetails[chainId]?.subgraphEndpoint : defaultSubgraphEndpoint;
};
