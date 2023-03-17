import * as React from 'react';
import {
  useGetScheduledTransferPools,
  useGetScheduledTransfersHistory,
} from '~/queries/tokenSalary/useGetScheduledTransfers';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ScheduledTransferPool } from '~/components/ScheduledTransfers/Pool';
import { ScheduledTransfersHistory } from '~/components/ScheduledTransfers/History';
import classNames from 'classnames';
import { Box } from '../common/Box';

export function OutgoingTokenSalaries({ userAddress, chainId }: { userAddress: string; chainId: number }) {
  const {
    data: pools,
    isLoading: fetchingPools,
    isError: failedToFetchPools,
  } = useGetScheduledTransferPools({ userAddress, chainId });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: failedToFetchHistory,
  } = useGetScheduledTransfersHistory({ userAddress, chainId, isPoolOwnersHistory: true });

  const t = useTranslations('Dashboard');

  const showPaymentFallabck = fetchingPools || failedToFetchPools || !pools || pools.length === 0;

  const showHistoryFallback = fetchingHistory || failedToFetchHistory || !history || history.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">Your Contracts</h1>

      {showPaymentFallabck ? (
        <Box className={classNames('grid min-h-[190px] items-center', fetchingPools && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {fetchingPools ? (
              ''
            ) : failedToFetchPools || !pools ? (
              t('errorFetchingData')
            ) : pools.length === 0 ? (
              <>
                Create a{' '}
                <Link href="/token-salaries/create" className="underline">
                  contract
                </Link>{' '}
                to schedule transfers
              </>
            ) : (
              ''
            )}
          </p>
        </Box>
      ) : (
        <>
          {pools.map((pool) => (
            <ScheduledTransferPool key={pool.poolContract} pool={pool} />
          ))}
        </>
      )}

      <h1 className="font-exo text-3xl font-extrabold">History</h1>

      {showHistoryFallback ? (
        <Box className={classNames('grid min-h-[190px] items-center', fetchingHistory && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {fetchingHistory
              ? ''
              : failedToFetchHistory || !history
              ? t('errorFetchingData')
              : history.length === 0
              ? "You don't have any history"
              : ''}
          </p>
        </Box>
      ) : (
        <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)]">
          <ScheduledTransfersHistory history={history} isPoolOwnersHistory />
        </div>
      )}
    </div>
  );
}
