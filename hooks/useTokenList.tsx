import * as React from 'react';
import { useNetworkProvider } from 'hooks';
import tokenLists from 'tokenLists';
import useGetAllTokens from 'queries/useGetAllTokens';
import { ITokenLists } from 'types';
import { useGetTokenList } from 'queries/useGetTokenList';
import { tokenWhitelist } from 'utils/constants';

export default function useTokenList() {
  const { chainId } = useNetworkProvider();

  const { data: tokens, isLoading, error } = useGetAllTokens();

  const { data: tokenList, isLoading: tokenListLoading } = useGetTokenList();

  const data: ITokenLists[] | null = React.useMemo(() => {
    if (tokens) {
      const verifiedLists = (!tokenListLoading && tokenList ? tokenList : chainId ? tokenLists[chainId] : null) ?? null;

      if (!verifiedLists) return null;

      return tokens.map((token) => {
        // always convert addresses to lowercase
        const address = token.tokenAddress.toLowerCase();
        const verifiedToken = verifiedLists[address];
        if (tokenWhitelist[address] !== undefined) {
          return {
            ...token,
            logoURI: tokenWhitelist[address].logoURI,
            name: tokenWhitelist[address].name,
            isVerified: tokenWhitelist[address].isVerified,
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
