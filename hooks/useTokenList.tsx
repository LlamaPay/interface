import * as React from 'react';
import { useNetworkProvider } from '~/hooks';
import tokenLists from '~/tokenLists';
import { useGetAllTokens } from '~/queries/useGetAllTokens';
import type { ITokenLists } from '~/types';
import { useGetTokenList } from '~/queries/useGetTokenList';
import { blacklist, whitelist } from '~/utils/constants';

export function useTokenList() {
  const { chainId } = useNetworkProvider();

  const { data: tokens, isLoading, error } = useGetAllTokens({ chainId });

  const { data: tokenList, isLoading: tokenListLoading } = useGetTokenList();

  const data: ITokenLists[] | null = React.useMemo(() => {
    if (tokens) {
      const verifiedLists = (!tokenListLoading && tokenList ? tokenList : chainId ? tokenLists[chainId] : null) ?? null;

      if (!verifiedLists) return null;

      const filteredTokens = tokens.filter((token) => !blacklist.includes(token.tokenAddress.toLowerCase()));

      return filteredTokens.map((token) => {
        // always convert addresses to lowercase
        const address = token.tokenAddress.toLowerCase();
        const verifiedToken = verifiedLists[address];
        if (whitelist[address] !== undefined) {
          return {
            ...token,
            logoURI: whitelist[address].logoURI,
            name: whitelist[address].name,
            isVerified: whitelist[address].isVerified,
          };
        }
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
