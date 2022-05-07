import { BaseProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useNetworkProvider } from 'hooks';
import { useQuery } from 'react-query';

async function fetchBalance(id: string, provider: BaseProvider | null) {
  if (!provider) return null;
  try {
    const balance = await provider.getBalance(id);
    return balance;
  } catch (error) {
    return null;
  }
}

export function useGetNativeBalance(id: string) {
  const { provider, network } = useNetworkProvider();

  return useQuery<BigNumber | null>(['nativebalance', network, id], () => fetchBalance(id, provider));
}
