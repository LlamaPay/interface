import { getAddress } from 'ethers/lib/utils';
import { useGraphEndpoint, useNetworkProvider } from '~/hooks';
import * as React from 'react';
import { useGetAllTokensQuery } from '~/services/generated/graphql';
import type { IToken } from '~/types';
import { createContract } from '~/utils/contract';
import { createERC20Contract } from '~/utils/tokenUtils';

const useGetAllTokens = () => {
  // get subgraph endpoint
  const endpoint = useGraphEndpoint()!;

  const { provider, network } = useNetworkProvider();

  const {
    data = null,
    isLoading,
    error,
  } = useGetAllTokensQuery(
    { endpoint },
    { network: network || '' },
    {
      staleTime: 30000,
      refetchInterval: 30000,
      retry: 1,
    }
  );

  // format the data in memo, instead of react query's select as graphql trigger rerenders multiple times when using it
  const tokens: IToken[] | null = React.useMemo(() => {
    if (data?.tokens && provider) {
      const result = data?.tokens.map((c) => ({
        tokenAddress: getAddress(c.address),
        llamaContractAddress: getAddress(c.contract?.id),
        name: c.name,
        symbol: c.symbol,
        decimals: c.decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(c.address), provider }),
        llamaTokenContract: createContract(getAddress(c.contract?.id), provider),
      }));
      return result.filter((c) => c.tokenAddress.toLowerCase() !== '0x0000000000000000000000000000000000001010');
    } else return null;
  }, [data, provider]);

  return React.useMemo(() => ({ data: tokens, isLoading, error }), [tokens, isLoading, error]);
};

export default useGetAllTokens;
