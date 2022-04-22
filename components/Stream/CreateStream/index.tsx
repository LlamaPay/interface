import * as React from 'react';
import Placeholder from './Placeholder';
import DepositAndCreate from './DepositAndCreate';
import CreateStreamOnly from './CreateStreamOnly';
import ErrorBoundary from './ErrorBoundary';
import { useBalances } from 'hooks';
import { useAccount } from 'wagmi';
import { useDialogState } from 'ariakit';

export const CreateStream = () => {
  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const { tokens, noBalances, isLoading, isError } = useBalances();

  const transactionDialog = useDialogState();

  const loading = accountDataLoading || isLoading;
  const error = isError || !tokens;

  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-3 text-center text-xl">
        {noBalances && !isLoading ? 'Deposit and Create a New stream' : 'Create a new stream'}
      </h1>
      {loading ? (
        <Placeholder />
      ) : error ? (
        <ErrorBoundary message="Something went wrong" />
      ) : noBalances ? (
        <DepositAndCreate tokens={tokens} userAddress={accountData?.address ?? ''} dialog={transactionDialog} />
      ) : (
        <CreateStreamOnly tokens={tokens} userAddress={accountData?.address ?? ''} dialog={transactionDialog} />
      )}
    </section>
  );
};
