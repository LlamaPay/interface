import { getAddress } from 'ethers/lib/utils';
import { useGraphEndpoint, useNetworkProvider } from 'hooks';
import * as React from 'react';
import { useGetAllTokensQuery } from 'services/generated/graphql';
import { IToken } from 'types';
import { createContract } from 'utils/contract';
import { createERC20Contract } from 'utils/tokenUtils';

const useGetAllTokens = () => {
  // get subgraph endpoint
  const endpoint = useGraphEndpoint();

  const { provider, network } = useNetworkProvider();

  const {
    data = null,
    isLoading,
    error,
  } = useGetAllTokensQuery(
    { endpoint },
    { network: network || '' },
    {
      refetchInterval: 10000,
    }
  );

  // format the data in memo, instead of react query's select as graphql trigger rerenders multiple times when using it
  const tokens: IToken[] | null = React.useMemo(() => {
    if (data?.tokens && provider) {
      return data?.tokens.map((c) => ({
        tokenAddress: getAddress(c.address),
        llamaContractAddress: getAddress(c.contract?.id),
        name: c.name,
        symbol: c.symbol,
        decimals: c.decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(c.address), provider }),
        llamaTokenContract: createContract(getAddress(c.contract?.id), provider),
      }));
    } else return null;
  }, [data, provider]);

  return React.useMemo(() => ({ data: tokens, isLoading, error }), [tokens, isLoading, error]);
};

export default useGetAllTokens;
