import * as React from 'react';
import { useNetworkProvider } from 'hooks';
import tokenLists from 'tokenLists';
import useGetAllTokens from 'queries/useGetAllTokens';
import { ITokenLists } from 'types';

export default function useTokenList(): ITokenLists[] | null {
  const { chainId } = useNetworkProvider();

  const { data: tokens } = useGetAllTokens();

  return React.useMemo(() => {
    if (chainId && tokens) {
      const verifiedLists = tokenLists.find((l) => l.chainId === chainId)?.list ?? [];

      return tokens.map((token) => {
        const verifiedToken = verifiedLists.find((t) => t.address === token.tokenAddress);
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
  }, [chainId, tokens]);
}
