import { useQuery } from 'react-query';
import { IBalance, ITokenLists } from 'types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { createERC20Contract } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import { Provider } from 'utils/contract';

const fetchBalance = async (
  id: string,
  tokens: ITokenLists[] | null,
  provider: Provider | null
): Promise<IBalance[] | null> => {
  if (!id || id === '' || !tokens || tokens.length < 1 || !provider) return null;
  try {
    const res = await Promise.allSettled(tokens.map((c) => c.llamaTokenContract.balances(id)));

    const data = res.flatMap((d, index) => {
      const amount =
        (d.status === 'fulfilled' && new BigNumber(d.value.toString()).dividedBy(10 ** 20)) ?? null;

      // filter zero balance tokens
      if (!amount || !(Number(amount) > 0)) return [];

      return {
        name: tokens[index]?.name,
        address: tokens[index]?.tokenAddress,
        symbol: tokens[index]?.symbol,
        logoURI: tokens[index]?.logoURI,
        amount: amount ? amount.toFixed(5) : '',
        contractAddress: tokens[index]?.llamaContractAddress,
        tokenDecimals: tokens[index].decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(tokens[index]?.tokenAddress), provider }),
        totalPaidPerSec: null,
        lastPayerUpdate: null,
      };
    });

    return data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

function useGetPayerBalance(contracts: ITokenLists[] | null, tokensKey: string, replacementPayerAddress?:string) {
  const [{ data: accountData }] = useAccount();
  const { provider } = useNetworkProvider();

  const payerAddress = replacementPayerAddress ?? accountData?.address.toLowerCase() ?? '';

  return useQuery<IBalance[] | null>(
    ['payerBalance', payerAddress, tokensKey],
    () => fetchBalance(payerAddress, contracts, provider),
    {
      refetchInterval: 10000,
    }
  );
}

export default useGetPayerBalance;
