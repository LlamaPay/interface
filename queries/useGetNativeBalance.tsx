import { BaseProvider } from '@ethersproject/providers';
import { BigNumber } from 'ethers';
import { useQuery } from 'react-query';
import { useProvider } from 'wagmi';

async function fetchBalance(id: string, provider: BaseProvider) {
  try {
    const balance = await provider.getBalance(id);
    return balance;
  } catch (error) {
    return null;
  }
}

export function useGetNativeBalance(id: string) {
  const provider = useProvider();

  return useQuery<BigNumber | null>(['balance', id], () => fetchBalance(id, provider));
}
