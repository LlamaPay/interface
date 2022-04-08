import { useNetworkProvider } from 'hooks';
import { createContract } from 'utils/contract';

function useGetContract(contractAddress: string) {
  const { provider } = useNetworkProvider();
  if (provider) {
    return createContract(contractAddress, provider);
  }
}

export default useGetContract;
