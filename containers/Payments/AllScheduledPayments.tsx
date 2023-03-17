import * as React from 'react';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { Box } from '../common/Box';
import { useGetPaymentsInfo } from '~/queries/payments/useGetPaymentsInfo';
import PaymentsTableActual from '~/components/Payments/Table';

export function AllScheduledPayments({
  userAddress,
  chainId,
  isIncoming,
}: {
  userAddress: string;
  chainId: number;
  isIncoming?: boolean;
}) {
  const { data, isLoading, isError } = useGetPaymentsInfo({ userAddress, chainId });

  const t = useTranslations('Dashboard');

  const streams =
    data?.filter((x) => (isIncoming ? x.payer !== userAddress.toLowerCase() : x.payer === userAddress.toLowerCase())) ??
    [];

  if (isLoading || isError || streams.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-exo text-3xl font-extrabold">All Vesting Streams</h1>
        <Box className={classNames('grid min-h-[190px] items-center', isLoading && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {isLoading ? '' : isError ? t('errorFetchingData') : t('noPendingOneTimePayments')}
          </p>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">All Scheduled Payments</h1>

      <PaymentsTableActual data={streams} />
    </div>
  );
}
