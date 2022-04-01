import * as React from 'react';
import { useTheme } from 'next-themes';
import Placeholder from './Placeholder';
import DepositAndCreate from './DepositAndCreate';
import CreateStreamOnly from './CreateStreamOnly';
import { ICreateProps } from './types';
import ErrorBoundary from './ErrorBoundary';

export const CreateStream = ({ tokens, noBalances, isLoading, isError }: ICreateProps) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Format tokens options to be used in select form element
  const tokenOptions = React.useMemo(
    () =>
      tokens?.map((c) => ({
        value: c.tokenAddress,
        label: `${c.name} (${c.symbol})`,
      })),
    [tokens]
  );

  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-3 text-center text-xl">
        {noBalances && !isLoading ? 'Deposit and create a new stream' : 'Create a new stream'}
      </h1>
      {isLoading ? (
        <Placeholder />
      ) : isError || !tokens || !tokenOptions ? (
        <ErrorBoundary message="Something went wrong" />
      ) : !noBalances ? (
        <DepositAndCreate tokens={tokens} tokenOptions={tokenOptions} isDark={isDark} />
      ) : (
        <CreateStreamOnly tokens={tokens} tokenOptions={tokenOptions} isDark={isDark} />
      )}
    </section>
  );
};
