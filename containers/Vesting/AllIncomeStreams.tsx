import * as React from 'react';
import { useGetVestingInfoByQueryParams } from '~/queries/vesting/useGetVestingInfo';
import classNames from 'classnames';
import type { IVesting } from '~/types';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import dynamic from 'next/dynamic';
import { FormDialog } from '~/components/Dialog';
import type { IChartValues } from '~/components/Vesting/types';
import VestingTable from '~/components/Vesting/Table';
import ClaimVesting from '~/components/Vesting/Table/ClaimVestingStream';
import { Box } from '../common/Box';

const VestingChart = dynamic(() => import('~/components/Vesting/Charts/VestingChart'), { ssr: false });

export function AllIncomeStreams({
  userAddress,
  chainId,
  isIncoming,
}: {
  userAddress: string;
  chainId: number;
  isIncoming?: boolean;
}) {
  const { data, isLoading, isError } = useGetVestingInfoByQueryParams({ userAddress, chainId });

  const chartDialog = useDialogState();

  const claimDialog = useDialogState();

  const chartValues = React.useRef<IChartValues | null>(null);
  const claimValues = React.useRef<IVesting | null>(null);

  const t = useTranslations('Dashboard');

  const streams =
    data?.filter((x) => (isIncoming ? x.admin !== userAddress.toLowerCase() : x.admin === userAddress.toLowerCase())) ??
    [];

  if (isLoading || isError || streams.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-exo text-3xl font-extrabold">All Vesting Streams</h1>
        <Box className={classNames('grid min-h-[190px] items-center', isLoading && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {isLoading ? '' : isError ? t('errorFetchingData') : t('noActiveVestingStreams')}
          </p>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">All Vesting Streams</h1>

      <VestingTable data={streams} {...{ chartValues, chartDialog, claimDialog, claimValues }} />

      <React.Suspense fallback={null}>
        {chartValues.current && (
          <FormDialog dialog={chartDialog} title={`${chartValues.current.tokenSymbol}`} className="max-w-[36rem]">
            <div className="h-[360px]">
              {chartDialog.open && (
                <VestingChart
                  amount={chartValues.current.amount}
                  vestingPeriod={chartValues.current.vestingPeriod}
                  cliffPeriod={chartValues.current.cliffPeriod}
                  startTime={chartValues.current.startTime}
                  vestedDays={chartValues.current.vestedDays}
                />
              )}
            </div>
          </FormDialog>
        )}

        {claimValues.current && (
          <ClaimVesting claimValues={claimValues as React.MutableRefObject<IVesting>} claimDialog={claimDialog} />
        )}
      </React.Suspense>
    </div>
  );
}
