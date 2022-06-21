import * as React from 'react';
import useGetPayerBalance from 'queries/useGetPayerBalance';
import usePayers from 'queries/usePayers';
import { useNetworkProvider } from './useNetworkProvider';
import { useTokenList } from '.';

export const useBalances = (payerAddress?: string) => {
  const { data: tokens, isLoading: tokensLoading, error: tokensError } = useTokenList();
  const { network } = useNetworkProvider();

  // pass a unique key to getpayerBalance query when tokens data changes
  // cuz initially when the component is mounted, tokens data is null
  // and useGetPayerBalance wouldn't refetch until specified interval
  // even though tokens are updated, this way it triggers a rerender and keeps the ui in loading state until we fetch balances on updated tokens data
  const tokensKey = tokens && tokens?.length > 0 ? `tokensExist ${network}` : `noTokens ${network}`;

  const {
    data: balances = null,
    isLoading: balancesLoading,
    error: balancesError,
  } = useGetPayerBalance(tokens, tokensKey, payerAddress);

  const { data: payersData } = usePayers(tokens, tokensKey, payerAddress);

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
        ?.sort((a, b) => {
          if (!a.amount || Number.isNaN(a.amount)) return -1;
          if (!b.amount || Number.isNaN(a.amount)) return 1;
          return Number(b.amount) - Number(a.amount);
        }) ?? null;

    return formattedBalances;
  }, [balances, payersData]);

  const isLoading = tokensLoading || balancesLoading;

  const isError = tokensError || balancesError ? true : false;

  const noBalances = !formattedBalances || formattedBalances.length === 0;

  return { balances: formattedBalances, noBalances, tokens, isLoading, isError };
};
