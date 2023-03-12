import * as React from 'react';
import { useLocale } from '~/hooks';
import type { IVesting } from '~/types';

export default function Unclaimed({ data }: { data: IVesting }) {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const { locale } = useLocale();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBalanceState(
        vestingWithdrawableAmtFormatter({
          disabledAt: data.disabledAt,
          tokenDecimals: data.tokenDecimals,
          unclaimed: data.unclaimed,
          totalLocked: data.totalLocked,
          startTime: data.startTime,
          endTime: data.endTime,
          cliffLength: data.cliffLength,
          timestamp: data.timestamp,
        })
      );
    }, 1);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{`${balanceState?.toLocaleString(
      locale,
      {
        minimumFractionDigits: 5,
        maximumFractionDigits: 5,
      }
    )}`}</span>
  );
}

export const vestingWithdrawableAmtFormatter = ({
  disabledAt,
  tokenDecimals,
  unclaimed,
  totalLocked,
  startTime,
  endTime,
  cliffLength,
  timestamp,
}: {
  disabledAt: string;
  tokenDecimals: number;
  unclaimed: string;
  totalLocked: string;
  startTime: string;
  endTime: string;
  cliffLength: string;
  timestamp: number;
}) => {
  if (Number(disabledAt) <= Date.now() / 1e3) {
    return Number(unclaimed) / 10 ** tokenDecimals;
  } else if (Date.now() / 1e3 > Number(endTime) || Date.now() / 1e3 < Number(startTime) + Number(cliffLength)) {
    return Number(unclaimed) / 10 ** tokenDecimals;
  } else {
    const amountPerSec = Number(totalLocked) / (Number(endTime) - Number(startTime)) / 10 ** tokenDecimals;

    return Number(unclaimed) / Number(10 ** tokenDecimals) + amountPerSec * (Date.now() / 1e3 - Number(timestamp));
  }
};
