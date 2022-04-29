import * as React from 'react';
import { useNetworkProvider } from 'hooks';
import tokenLists from 'tokenLists';
import useGetAllTokens from 'queries/useGetAllTokens';
import { ITokenLists } from 'types';
import { useGetTokenList } from 'queries/useGetTokenList';

interface ITokenList {
  address: string;
  logoURI: string;
}

export default function useTokenList() {
  const { chainId } = useNetworkProvider();

  const { data: tokens, isLoading, error } = useGetAllTokens();

  const { data: tokenList, isLoading: tokenListLoading } = useGetTokenList();

  const data: ITokenLists[] | null = React.useMemo(() => {
    if (tokens) {
      const verifiedLists =
        (!tokenListLoading && tokenList
          ? tokenList
          : tokenLists.find((l) => l.chainId.toString() === chainId?.toString())?.list) ?? [];

      return tokens.map((token) => {
        const verifiedToken = verifiedLists.find(
          (t: ITokenList) => t.address.toLowerCase() === token.tokenAddress.toLowerCase()
        );

        return {
          ...token,
          logoURI:
            verifiedToken?.logoURI ??
            'https://raw.githubusercontent.com/LlamaPay/interface/main/public/empty-token.webp',
          isVerified: verifiedToken ? true : false,
          name: verifiedToken?.name ?? token.name,
        };
      });
    } else return null;
  }, [chainId, tokens, tokenListLoading, tokenList]);

  return { data, isLoading: isLoading || tokenListLoading, error };
}
