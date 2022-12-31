import * as React from 'react';
import { DisclosureState } from 'ariakit';
import type { IVesting } from '~/types';
import type { IChartValues } from '~/components/Vesting/types';

export default function ChartButton({
  data,
  dialog,
  chartValues,
}: {
  data: IVesting;
  dialog: DisclosureState;
  chartValues: React.MutableRefObject<IChartValues | null>;
}) {
  const values = React.useMemo(() => {
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

  const showChart = () => {
    chartValues.current = { ...values, tokenSymbol: data.tokenSymbol };
    dialog.toggle();
  };

  return (
    <button className="row-action-links" onClick={showChart}>
      Chart
    </button>
  );
}
