import { useQuery } from '@tanstack/react-query';
import type { ITokenLists } from '~/types';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { useNetworkProvider, useTokenList } from '~/hooks';
import { Provider } from '~/utils/contract';
import { Contract } from 'ethers';
import { Multicall } from 'ethereum-multicall';

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
  if (!userAddress || userAddress === '' || !tokens || !provider) return null;

  try {
    const multicall = new Multicall({ ethersProvider: provider, tryAggregate: true });
    const res2 = await multicall.call(
      tokens.map((token) => ({
        reference: token.tokenContract.address,
        contractAddress: token.tokenContract.address,
        abi: [
          {
            inputs: [{ internalType: 'address', name: '', type: 'address' }],
            name: 'balanceOf',
            outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
            stateMutability: 'view',
            type: 'function',
          },
        ],
        calls: [{ reference: 'balanceOf', methodName: 'balanceOf', methodParameters: [userAddress] }],
      }))
    );

    const balances =
      tokens
        ?.map((token, index) => {
          const bal = new BigNumber(
            res2.results[token.tokenContract.address].callsReturnContext[0].returnValues[0].hex
          ).dividedBy(10 ** tokens[index].decimals);

          return {
            name: tokens[index].isVerified ? tokens[index].name : tokens[index].tokenAddress,
            tokenAddress: tokens[index].tokenAddress,
            decimals: tokens[index].decimals,
            tokenContract: tokens[index].tokenContract,
            llamaContractAddress: tokens[index].llamaContractAddress,
            symbol: tokens[index].symbol,
            logoURI: tokens[index].logoURI,
            balance: bal ? formatNum(bal.toString()) : null,
          };
        })
        ?.sort((a, b) => {
          if (!a.balance || Number.isNaN(a.balance)) return -1;
          if (!b.balance || Number.isNaN(a.balance)) return 1;
          return Number(b.balance) - Number(a.balance);
        }) ?? null;

    return balances;
  } catch (error) {
    // console.log(error);
    return null;
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
      refetchInterval: 30000,
    }
  );

  return { ...data, listLoading };
}

export default useTokenBalances;

export const formatNum = (value: string) => {
  const [num, decimals] = value.split('.');
  let final = num;
  if (decimals) {
    final += '.';
    let cur = 0;
    decimals.split('').forEach((point, index) => {
      if (cur < 2) {
        final += point;
        if (point !== '0') {
          cur += index > 0 && cur === 0 ? 2 : 1;
        }
      }
    });
  }
  return final;
};
