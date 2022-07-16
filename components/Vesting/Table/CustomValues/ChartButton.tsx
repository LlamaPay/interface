import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { IVesting } from 'types';
import dynamic from 'next/dynamic';

const VestingChart = dynamic(() => import('../../Chart'), { ssr: false });

export default function ChartButton({ data }: { data: IVesting }) {
  const dialog = useDialogState();

  const { vestingPeriod, amount, startTime, vestedDays, cliffPeriod } = React.useMemo(() => {
    const vestingPeriod = (Number(data.endTime) - Number(data.startTime)) / 86400;
    const amount = Number(data.totalLocked) / 10 ** Number(data.tokenDecimals);
    const startTime = new Date(Number(data.startTime) * 1000);

    const vestedDays =
      data.timestamp > Number(data.startTime)
        ? ((Number(data.timestamp) - Number(data.startTime)) / 86400).toFixed(0)
        : null;

    const cliffPeriod = Number(data.cliffLength) / 86400;

    return { vestingPeriod, amount, startTime, vestedDays, cliffPeriod };
  }, [data]);

  return (
    <>
      <button className="row-action-links" onClick={dialog.toggle}>
        Chart
      </button>
      <FormDialog dialog={dialog} title={`${data.tokenSymbol}`} className="max-w-[36rem]">
        <div className="h-[360px]">
          {dialog.visible && (
            <VestingChart
              amount={amount}
              vestingPeriod={vestingPeriod}
              cliffPeriod={cliffPeriod}
              startTime={startTime}
              vestedDays={vestedDays}
            />
          )}
        </div>
      </FormDialog>
    </>
  );
}
