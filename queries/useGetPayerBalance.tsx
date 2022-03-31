import { useQuery } from 'react-query';
import { IBalance, IToken } from 'types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';

// TODO update chain name based on user wallet network
const fetchBalance = async (id: string, tokens: IToken[] | null): Promise<IBalance[] | null> => {
  if (!id || id === '' || !tokens || tokens.length < 1) return null;
  try {
    const res = await Promise.allSettled(tokens.map((c) => c.llamaTokenContract.getPayerBalance(id)));

    // filter zero balance tokens
    const data = res

      .map((d, index) => {
        const amount =
          (d.status === 'fulfilled' && new BigNumber(d.value.toString()).dividedBy(10 ** tokens[index].decimals)) ??
          null;
        return {
          name: tokens[index]?.name,
          address: tokens[index]?.tokenAddress,
          symbol: tokens[index]?.symbol,
          amount: amount ? amount.toFixed(0) : '',
          contractAddress: tokens[index]?.llamaContractAddress,
        };
      })
      .filter((d) => d.amount !== '0');

    return data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

function useGetPayerBalance(contracts: IToken[] | null, tokensKey: string) {
  const [{ data: accountData }] = useAccount();

  const payerAddress = accountData?.address.toLowerCase() ?? '';

  const { refetch, ...data } = useQuery<IBalance[] | null>(
    ['payerBalance', payerAddress, tokensKey],
    () => fetchBalance(payerAddress, contracts),
    {
      refetchInterval: 10000,
    }
  );

  return { ...data, refetch };
}

export default useGetPayerBalance;
