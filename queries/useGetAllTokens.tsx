import { getAddress } from 'ethers/lib/utils';
import { Provider, createContract } from '~/utils/contract';
import { createERC20Contract } from '~/utils/tokenUtils';
import { gql, request } from 'graphql-request';
import { networkDetails } from '~/lib/networkDetails';
import { useQuery } from '@tanstack/react-query';
import { Contract } from 'ethers';

interface IToken {
  address: string;
  contract: { id: string };
  decimals: number;
  name: string;
  symbol: string;
}

interface IFormattedToken {
  tokenAddress: string;
  llamaContractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
  tokenContract: Contract;
  llamaTokenContract: Contract;
}

async function fetchAllTokens({ provider, endpoint }: { provider?: Provider | null; endpoint?: string | null }) {
  try {
    if (!provider || !endpoint) return [];

    const data = await request<{ tokens: Array<IToken> }>(
      endpoint,
      gql`
        {
          tokens(first: 100) {
            address
            symbol
            name
            decimals
            contract {
              id
            }
          }
        }
      `
    );

    return data?.tokens
      .map((c: IToken) => ({
        tokenAddress: getAddress(c.address),
        llamaContractAddress: getAddress(c.contract?.id),
        name: c.name,
        symbol: c.symbol,
        decimals: c.decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(c.address), provider }),
        llamaTokenContract: createContract(getAddress(c.contract?.id), provider),
      }))
      .filter((c: IFormattedToken) => c.tokenAddress.toLowerCase() !== '0x0000000000000000000000000000000000001010');
  } catch (error: any) {
    throw new Error(error.message || (error?.reason ?? "Couldn't fetch tokens list"));
  }
}

export const useGetAllTokens = ({ chainId }: { chainId?: number | null }) => {
  // get subgraph endpoint
  const endpoint = chainId ? networkDetails[chainId]?.subgraphEndpoint : null;
  const provider = chainId ? networkDetails[chainId]?.chainProviders : null;

  return useQuery<Array<IFormattedToken>>(['salaryTokensList', chainId], () => fetchAllTokens({ endpoint, provider }), {
    refetchInterval: 30000,
  });
};
