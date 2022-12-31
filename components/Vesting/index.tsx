import * as React from 'react';
import Fallback, { FallbackContainer } from '~/components/Fallback';
import useGetVestingInfo from '~/queries/useGetVestingInfo';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import Link from 'next/link';
import classNames from 'classnames';
import type { IVesting } from '~/types';
import { useTranslations } from 'next-intl';
import { useDialogState } from 'ariakit';
import dynamic from 'next/dynamic';
import { FormDialog } from '~/components/Dialog';
import type { IChartValues } from './types';
import VestingTable from './Table';
import ClaimVesting from './Table/ClaimVestingStream';

const VestingChart = dynamic(() => import('./Charts/VestingChart'), { ssr: false });

export default function VestingSection() {
  const { chainId } = useNetworkProvider();

  const vestingFactory = chainId ? networkDetails[chainId]?.vestingFactory : null;

  const { data, isLoading, error } = useGetVestingInfo();

  const chartDialog = useDialogState();

  const claimDialog = useDialogState();

  const chartValues = React.useRef<IChartValues | null>(null);
  const claimValues = React.useRef<IVesting | null>(null);

  return (
    <section className="-mt-2 w-full">
      <div className="section-header flex w-full flex-wrap items-center justify-between">
        <h1 className="font-exo">Vesting</h1>
        <Link href="/vesting/create" aria-disabled={!vestingFactory}>
          <a
            className={classNames(
              'primary-button text-md py-2 px-5 text-center font-bold',
              !vestingFactory && 'pointer-events-none opacity-50 hover:cursor-not-allowed'
            )}
            aria-disabled={!vestingFactory}
          >
            {'Create Contract'}
          </a>
        </Link>
      </div>

      {isLoading || error || !data || data.length < 1 ? (
        <Fallback
          isLoading={isLoading}
          isError={error ? true : false}
          noData={true}
          type={'vestingStreams'}
          showLoader={true}
        />
      ) : (
        <VestingTable {...{ data, chartValues, chartDialog, claimDialog, claimValues }} />
      )}

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
    </section>
  );
}

interface IAltVestingSectionProps {
  isLoading: boolean;
  isError: boolean;
  data?: IVesting[] | null;
}

export function AltVestingSection({ isLoading, isError, data }: IAltVestingSectionProps) {
  const t = useTranslations('Streams');

  const chartDialog = useDialogState();
  const claimDialog = useDialogState();
  const reasonDialog = useDialogState();

  const chartValues = React.useRef<IChartValues | null>(null);
  const claimValues = React.useRef<IVesting | null>(null);

  return (
    <section className="w-full">
      <div className="section-header">
        <h1 className="font-exo">Streams</h1>
      </div>

      {isLoading || isError || !data || data.length < 1 ? (
        <FallbackContainer>
          {isLoading ? null : isError ? (
            <p>{t('error')}</p>
          ) : !data || data.length < 1 ? (
            <p>{t('noActiveStreams')}</p>
          ) : null}
        </FallbackContainer>
      ) : (
        <VestingTable {...{ data, chartValues, chartDialog, claimDialog, reasonDialog, claimValues }} />
      )}

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
    </section>
  );
}
