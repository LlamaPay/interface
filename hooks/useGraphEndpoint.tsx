import { networkDetails } from '~/lib/networkDetails';
import { useNetworkProvider } from './useNetworkProvider';

export const useGraphEndpoint = () => {
  // get users network
  const { chainId } = useNetworkProvider();

  return chainId ? networkDetails[chainId]?.subgraphEndpoint : "";
};
