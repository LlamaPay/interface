import { ethers } from 'ethers';
import { useQuery } from 'react-query';

interface Contract {
  address: string;
  token: string;
  contract: ethers.Contract;
}

interface Balance {
  token: string;
  address: string;
  amount: string;
}

// TODO update chain name based on user wallet network
const fetchBalance = async (id: string, contracts: Contract[]): Promise<Balance[] | null> => {
  if (!id) return null;
  const res = await Promise.allSettled(contracts.map((c) => c.contract.getPayerBalance(id)));

  const data = res
    .filter((d) => d.status === 'fulfilled' && d.value.toString() !== '0')
    .map((d, index) => ({
      token: contracts[index]?.token,
      address: contracts[index]?.token,
      amount: d.status === 'fulfilled' ? d.value?.toString() : '',
    }));
  return data;
};

// TODO add types and handle errors
export function useGetPayerBalance(id: string, contracts: Contract[]) {
  return useQuery(['payerBalance', id], () => fetchBalance(id, contracts), {
    refetchInterval: 10000,
  });
}
