import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from '~/hooks';
import { Provider } from '~/utils/contract';
import type { IPayer, IToken } from '~/types';
import BigNumber from 'bignumber.js';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { Multicall } from 'ethereum-multicall';
import { llamaContractABI } from '~/lib/abis/llamaContract';

const fetchPayers = async (userAddress: string, tokens: IToken[] | null, provider: Provider | null) => {
  if (!userAddress || userAddress === '' || !tokens || tokens.length < 1 || !provider) return null;
  try {
    const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });

    const res2 = await multicall.call(
      tokens.map((token) => ({
        reference: token.llamaTokenContract.address,
        contractAddress: token.llamaTokenContract.address,
        abi: llamaContractABI,
        calls: [{ reference: 'payers', methodName: 'payers', methodParameters: [getAddress(userAddress)] }],
      }))
    );

    const data = tokens.map((token) => {
      const values = res2.results[getAddress(token.llamaTokenContract.address)]?.callsReturnContext?.[0]?.returnValues;

      const lastPayerUpdate = values[0];
      const totalPaidPerSec = values[1]?.hex ? new BigNumber(values[1].hex).toFixed(5) : '';

      return {
        name: token.name,
        address: token.tokenAddress,
        symbol: token.symbol,
        contractAddress: token.llamaContractAddress,
        tokenDecimals: token.decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(token.tokenAddress), provider }),
        totalPaidPerSec: totalPaidPerSec,
        lastPayerUpdate,
      };
    });

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// query that returns lastPayerUpdate, totalPaidPerSec when user address is passed
function usePayers(tokens: IToken[] | null, tokensKey: string, replacementAddress?: string) {
  const { address } = useAccount();
  const { provider } = useNetworkProvider();

  const userAddress = replacementAddress ?? address?.toLowerCase() ?? '';

  return useQuery<IPayer[] | null>(['payers', userAddress, tokensKey], () =>
    fetchPayers(userAddress, tokens, provider)
  );
}

export default usePayers;
