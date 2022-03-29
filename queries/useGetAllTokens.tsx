import { getAddress } from 'ethers/lib/utils';
import * as React from 'react';
import { useGetAllTokensQuery } from 'services/generated/graphql';
import { IToken } from 'types';
import { createContract } from 'utils/contract';
import { createERC20Contract } from 'utils/tokenUtils';

const useGetAllTokens = () => {
  const { data = null, isLoading, error } = useGetAllTokensQuery();

  // format the data in memo, instead of react query's select as graphql trigger rerenders multiple times when using it
  const tokens: IToken[] | null = React.useMemo(() => {
    if (data?.tokens) {
      return data?.tokens.map((c) => ({
        tokenAddress: getAddress(c.address),
        llamaTokenAddress: getAddress(c.contract?.id),
        name: c.name,
        symbol: c.symbol,
        decimals: c.decimals,
        tokenContract: createERC20Contract({ tokenAddress: getAddress(c.address) }),
        llamaTokenContract: createContract(getAddress(c.contract?.id)),
      }));
    } else return null;
  }, [data]);

  return React.useMemo(() => ({ data: tokens, isLoading, error }), [tokens, isLoading, error]);
};

export default useGetAllTokens;
