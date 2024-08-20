import { useQuery } from '@tanstack/react-query';
import type { IBalance, ITokenLists } from '~/types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { createERC20Contract } from '~/utils/tokenUtils';
import { getAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from '~/hooks';
import { Provider } from '~/utils/contract';
import { Multicall } from 'ethereum-multicall';
import { llamaContractABI } from '~/lib/abis/llamaContract';
import { getMulticall } from './getMulticall';

const fetchBalance = async (
  id: string,
  tokens: ITokenLists[] | null,
  provider: Provider | null
): Promise<IBalance[] | null> => {
  if (!id || id === '' || !tokens || tokens.length < 1 || !provider) return null;

  try {
    const multicall = getMulticall(provider)

    const res2 = await multicall.call(
      tokens.map((token) => ({
        reference: token.llamaTokenContract.address,
        contractAddress: token.llamaTokenContract.address,
        abi: llamaContractABI,
        calls: [{ reference: 'balances', methodName: 'balances', methodParameters: [id] }],
      }))
    );

    const data = tokens
      .map((token) => {
        const amount =
          res2.results[getAddress(token.llamaTokenContract.address)]?.callsReturnContext?.[0]?.returnValues[0]?.hex;

        return {
          name: token.name,
          address: token.tokenAddress,
          symbol: token.symbol,
          logoURI: token.logoURI,
          amount: amount ? new BigNumber(amount).dividedBy(10 ** 20).toFixed(5) : '0',
          contractAddress: token.llamaContractAddress,
          tokenDecimals: token.decimals,
          tokenContract: createERC20Contract({ tokenAddress: getAddress(token.tokenAddress), provider }),
          totalPaidPerSec: null,
          lastPayerUpdate: null,
        };
      })
      .filter((item) => Number(item.amount) > 0);

    return data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

function useGetPayerBalance(contracts: ITokenLists[] | null, tokensKey: string, replacementPayerAddress?: string) {
  const { address } = useAccount();
  const { provider } = useNetworkProvider();

  const payerAddress = replacementPayerAddress ?? address?.toLowerCase() ?? '';

  return useQuery<IBalance[] | null>(
    ['payerBalance', payerAddress, tokensKey],
    () => fetchBalance(payerAddress, contracts, provider),
    {
      refetchInterval: 30000,
    }
  );
}

export default useGetPayerBalance;
