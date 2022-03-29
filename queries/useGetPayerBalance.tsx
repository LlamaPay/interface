import { useQuery } from 'react-query';
import { IBalance, IToken } from 'types';
import { useAccount } from 'wagmi';

// TODO update chain name based on user wallet network
const fetchBalance = async (id: string, tokens: IToken[] | null): Promise<IBalance[] | null> => {
  if (!id || id === '' || !tokens || tokens.length < 1) return null;

  try {
    const res = await Promise.allSettled(tokens.map((c) => c.llamaTokenContract.getPayerBalance(id)));

    // filter zero balance tokens
    const data = res
      .filter((d) => d.status === 'fulfilled' && d.value.toString() !== '0')
      .map((d, index) => ({
        token: tokens[index]?.name,
        address: tokens[index]?.tokenAddress,
        amount: d.status === 'fulfilled' ? d.value?.toString() : '',
      }));
    return data;
  } catch (error) {
    // console.log(error)
    return null;
  }
};

function useGetPayerBalance(contracts: IToken[] | null) {
  const [{ data: accountData }] = useAccount();
  const payerAddress = accountData?.address.toLowerCase() ?? '';
  return useQuery<IBalance[] | null>(['payerBalance', payerAddress], () => fetchBalance(payerAddress, contracts), {
    refetchInterval: 10000,
  });
}

export default useGetPayerBalance;
