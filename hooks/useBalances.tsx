import * as React from 'react';
import useGetAllTokens from 'queries/useGetAllTokens';
import useGetPayerBalance from 'queries/useGetPayerBalance';
import usePayers from 'queries/usePayers';
import { useNetworkProvider } from './useNetworkProvider';

export const useBalances = () => {
  const { data: tokens, isLoading: tokensLoading, error: tokensError } = useGetAllTokens();
  const { network } = useNetworkProvider();

  // pass a unique key to getpayerBalance query when tokens data changes
  // cuz initially when the component is mounted, tokens data is null
  // and useGetPayerBalance wouldn't refetch until specified interval
  // even though tokens are updated, this way it triggers a rerender and keeps the ui in loading state until we fetch balances on updated tokens data
  const tokensKey = React.useMemo(() => {
    return tokens && tokens?.length > 0 ? `tokensExist ${network}` : `noTokens ${network}`;
  }, [tokens, network]);

  const {
    data: balances = null,
    isLoading: balancesLoading,
    error: balancesError,
  } = useGetPayerBalance(tokens, tokensKey);

  const { data: payersData } = usePayers(tokens, tokensKey);

  const formattedBalances = React.useMemo(() => {
    const formattedBalances =
      balances
        ?.map((b) => {
          const payers = payersData?.find((p) => p.address === b.address);

          return {
            ...b,
            totalPaidPerSec: payers?.totalPaidPerSec ?? null,
            lastPayerUpdate: payers?.lastPayerUpdate ?? null,
          };
        })
        ?.sort(({ amount: first }, { amount: second }) => {
          if (first < second) {
            return -1;
          }
          if (first > second) {
            return 1;
          }
          return 0;
        }) ?? null;

    return formattedBalances;
  }, [balances, payersData]);

  const isLoading = tokensLoading || balancesLoading;
  const noBalances = !formattedBalances || formattedBalances.length === 0;

  const isError = tokensError || balancesError ? true : false;

  return { balances: formattedBalances, tokens, noBalances, isLoading, isError };
};
