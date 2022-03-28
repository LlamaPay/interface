import { ethers } from 'ethers';
import { useQuery } from 'react-query';
import { useAccount } from 'wagmi';

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
  if (!id || id === '') return null;

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

export function useGetPayerBalance(contracts: Contract[]) {
  const [{ data: accountData }] = useAccount();
  const payerAddress = accountData?.address ?? '';
  return useQuery(['payerBalance', payerAddress], () => fetchBalance(payerAddress, contracts), {
    refetchInterval: 10000,
  });
}
