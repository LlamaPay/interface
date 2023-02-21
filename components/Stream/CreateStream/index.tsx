import * as React from 'react';
import Placeholder from './Placeholder';
import ErrorBoundary from './ErrorBoundary';
import { useBalances } from '~/hooks';
import { useAccount } from 'wagmi';
import { StreamIcon } from '~/components/Icons';
import useTokenBalances from '~/queries/useTokenBalances';
import CreateMultipleStreams from './CreateMultipleStreams';
import { useTranslations } from 'next-intl';

export const CreateStream = () => {
  const { isConnecting } = useAccount();

  const { isLoading, isError } = useBalances();

  const { data: tokens, isLoading: tokenBalancesLoading, isError: tokenBalancesError } = useTokenBalances();

  const loading = isConnecting || isLoading || tokenBalancesLoading;

  const error = isError || tokenBalancesError || !tokens;

  const t = useTranslations('CreateStream');

  return (
    <section className="z-2 mx-auto flex w-full max-w-lg flex-col">
      <h1 className="font-exo mb-5 flex items-center gap-[0.625rem] text-2xl font-semibold text-lp-gray-4 dark:text-white">
        <StreamIcon />
        <span>{t('createANewStream')}</span>
      </h1>
      {loading ? (
        <Placeholder />
      ) : error ? (
        <ErrorBoundary message={t('sus')} />
      ) : (
        <CreateMultipleStreams tokens={tokens} />
      )}
    </section>
  );
};
