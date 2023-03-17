import { useQuery } from '@tanstack/react-query';
import type { ITokenLists } from '~/types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useNetworkProvider, useTokenList } from '~/hooks';
import { Provider } from '~/utils/contract';
import { Contract } from 'ethers';

interface IFetchBalance {
  userAddress: string;
  tokens: ITokenLists[] | null;
  provider: Provider | null;
}

export interface ITokenBalance {
  name: string;
  tokenAddress: string;
  decimals: number;
  tokenContract: Contract;
  llamaContractAddress: string;
  symbol: string;
  logoURI: string;
  balance: string | null;
}

const fetchBalance = async ({ userAddress, tokens, provider }: IFetchBalance) => {
  if (!userAddress || userAddress === '' || !tokens || !provider) return [];

  try {
    const res = await Promise.allSettled(tokens.map((token) => token.tokenContract.balanceOf(userAddress)));

    const balances =
      (
        res
          ?.map((item, index) => {
            if (item.status === 'fulfilled') {
              const bal = new BigNumber(item.value.toString()).dividedBy(10 ** tokens[index].decimals);

              return {
                name: tokens[index].isVerified ? tokens[index].name : tokens[index].tokenAddress,
                tokenAddress: tokens[index].tokenAddress,
                decimals: tokens[index].decimals,
                tokenContract: tokens[index].tokenContract,
                llamaContractAddress: tokens[index].llamaContractAddress,
                symbol: tokens[index].symbol,
                logoURI: tokens[index].logoURI,
                balance: bal ? Math.floor((Number(bal) * 100000) / 100000).toFixed(5) : null,
              };
            }
            return null;
          })
          ?.filter((item) => item !== null) as Array<ITokenBalance>
      )?.sort((a, b) => {
        if (!a.balance || Number.isNaN(a.balance)) return -1;
        if (!b.balance || Number.isNaN(a.balance)) return 1;
        return Number(b.balance) - Number(a.balance);
      }) ?? [];

    return balances;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch token balances"));
  }
};

function useTokenBalances() {
  const { address } = useAccount();
  const { provider, network } = useNetworkProvider();
  const { data: tokens, isLoading: listLoading } = useTokenList();

  const userAddress = address?.toLowerCase() ?? '';

  const listKey =
    tokens && tokens?.length > 0
      ? `listsExist ${network} ${userAddress} ${listLoading}`
      : `noList ${network} ${userAddress} ${listLoading}`;

  const data = useQuery<ITokenBalance[] | null>(
    ['allTokenBalances', listKey],
    () => fetchBalance({ userAddress, tokens, provider }),
    {
      refetchInterval: 30_000,
    }
  );

  return { ...data, listLoading };
}

export default useTokenBalances;
