import * as React from 'react';
import Placeholder from './Placeholder';
import DepositAndCreate from './DepositAndCreate';
import CreateStreamOnly from './CreateStreamOnly';
import ErrorBoundary from './ErrorBoundary';
import { useBalances } from 'hooks';
import { useAccount } from 'wagmi';
import { useDialogState } from 'ariakit';
import { StreamIcon } from 'components/Icons';
import useTokenBalances from 'queries/useTokenBalances';

export const CreateStream = () => {
  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const { noBalances, isLoading, isError } = useBalances();

  const { data: tokens, isLoading: tokenBalancesLoading, isError: tokenBalancesError } = useTokenBalances();

  const transactionDialog = useDialogState();

  const loading = accountDataLoading || isLoading || tokenBalancesLoading;

  const error = isError || tokenBalancesError || !tokens;

  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="font-exo mb-5 flex items-center gap-[0.625rem] text-2xl font-semibold text-[#3D3D3D]">
        <StreamIcon />
        <span>{noBalances && !isLoading ? 'Deposit and Create a New stream' : 'Create a New Stream'}</span>
      </h1>
      {loading ? (
        <Placeholder />
      ) : error ? (
        <ErrorBoundary message="Something went wrong" />
      ) : !noBalances ? (
        <DepositAndCreate tokens={tokens} userAddress={accountData?.address ?? ''} dialog={transactionDialog} />
      ) : (
        <CreateStreamOnly tokens={tokens} userAddress={accountData?.address ?? ''} dialog={transactionDialog} />
      )}
    </section>
  );
};
