import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import { Provider } from 'utils/contract';
import { IPayer, IToken } from 'types';
import BigNumber from 'bignumber.js';
import { createERC20Contract } from 'utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';

const fetchPayers = async (userAddress: string, tokens: IToken[] | null, provider: Provider | null) => {
  if (!userAddress || userAddress === '' || !tokens || tokens.length < 1 || !provider) return null;
  try {
    const res = await Promise.allSettled(tokens.map((c) => c.llamaTokenContract.payers(userAddress)));

    const data: IPayer[] = res.map((d, index) => {
      const amount = (d.status === 'fulfilled' && new BigNumber(d.value?.totalPaidPerSec?.toString())) ?? null;

      const lastPayerUpdate = d.status === 'fulfilled' ? d.value?.lastPayerUpdate ?? null : null;

      return {
        name: tokens[index]?.name,
        address: tokens[index]?.tokenAddress,
        symbol: tokens[index]?.symbol,
        contractAddress: tokens[index]?.llamaContractAddress,
        tokenDecimals: tokens[index].decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(tokens[index]?.tokenAddress), provider }),
        totalPaidPerSec: amount ? amount.toFixed(5) : '',
        lastPayerUpdate,
      };
    });

    return data;
  } catch (error) {
    // console.log(error);
    return null;
  }
};

// query that returns lastPayerUpdate, totalPaidPerSec when user address is passed
function usePayers(tokens: IToken[] | null, tokensKey: string, replacementAddress?: string) {
  const [{ data: accountData }] = useAccount();
  const { provider } = useNetworkProvider();

  const userAddress = replacementAddress ?? accountData?.address.toLowerCase() ?? '';

  return useQuery<IPayer[] | null>(['payers', userAddress, tokensKey], () =>
    fetchPayers(userAddress, tokens, provider)
  );
}

export default usePayers;
