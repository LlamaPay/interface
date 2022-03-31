import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import Balance from 'components/Balance';
import { useAccount } from 'wagmi';
import useGetPayerBalance from 'queries/useGetPayerBalance';
import useGetAllTokens from 'queries/useGetAllTokens';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();

  const { data: tokens, isLoading: tokensLoading, error: tokensError } = useGetAllTokens();

  // pass a unique key to getpayerBalance query when tokens data changes
  // cuz initially when the component is mounted, tokens data is null
  // and useGetPayerBalance wouldn't refetch until specified interval
  // even though tokens are updated, this way it triggers a rerender and keeps the ui in loading state until we fetch balances on updated tokens data
  const tokensKey = React.useMemo(() => {
    return tokens && tokens?.length > 0 ? Date.now().toString() : '';
  }, [tokens]);

  const {
    data: balances = null,
    isLoading: balancesLoading,
    error: balancesError,
  } = useGetPayerBalance(tokens, tokensKey);

  const isLoading = tokensLoading || balancesLoading;
  const noBalances = !balances || balances.length === 0;

  const isError = tokensError || balancesError ? true : false;

  return (
    <Layout className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center space-y-6 xl:flex-row xl:items-start xl:justify-between xl:space-x-2 xl:space-y-0">
      {!accountData ? (
        <p className="mx-auto mt-8 text-red-500">Connect wallet to continue</p>
      ) : (
        <>
          <Balance balances={balances} noBalances={noBalances} isLoading={isLoading} isError={isError} />
          <CreateStream tokens={tokens} noBalances={noBalances} isLoading={isLoading} isError={isError} />
        </>
      )}
    </Layout>
  );
};

export default Create;
