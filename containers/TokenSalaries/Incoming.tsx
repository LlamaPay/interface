import * as React from 'react';
import {
  useGetScheduledPayments,
  useGetScheduledTransfersHistory,
} from '~/queries/tokenSalary/useGetScheduledTransfers';
import { useTranslations } from 'next-intl';
import { ScheduledTransferPayment } from '~/components/ScheduledTransfers/Payment';
import { ScheduledTransfersHistory } from '~/components/ScheduledTransfers/History';
import classNames from 'classnames';
import { Box } from '../common/Box';

export function IncomingTokenSalaries({ userAddress, chainId }: { userAddress: string; chainId: number }) {
  const {
    data: payments,
    isLoading: fetchingPayments,
    isError: failedToFetchPayments,
  } = useGetScheduledPayments({ userAddress, chainId });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: failedToFetchHistory,
  } = useGetScheduledTransfersHistory({ userAddress, chainId });

  const t = useTranslations('Dashboard');

  const showPaymentFallabck = fetchingPayments || failedToFetchPayments || !payments || payments.length === 0;

  const showHistoryFallback = fetchingHistory || failedToFetchHistory || !history || history.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">Token Salaries</h1>

      {showPaymentFallabck ? (
        <Box className={classNames('grid min-h-[190px] items-center', fetchingPayments && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {fetchingPayments
              ? ''
              : failedToFetchPayments || !payments
              ? t('errorFetchingData')
              : payments.length === 0
              ? "You don't have any token salary streams"
              : ''}
          </p>
        </Box>
      ) : (
        <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)]">
          <ScheduledTransferPayment payments={payments} isIncoming />
        </div>
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
          <ScheduledTransfersHistory history={history} />
        </div>
      )}
    </div>
  );
}
