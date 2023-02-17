import { useLocale } from '~/hooks';
import { IVesting } from '~/types';
import * as React from 'react';

export default function Vested({ data }: { data: IVesting }) {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const { locale } = useLocale();
  const setState = React.useCallback(() => {
    const now = Date.now() / 1e3;
    if (now >= Number(data.disabledAt) && data.disabledAt === data.endTime) {
      setBalanceState(Number(data.totalLocked) / 10 ** Number(data.tokenDecimals));
    } else if (now >= Number(data.disabledAt)) {
      const amountPerSec =
        Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime)) / 10 ** data.tokenDecimals;
      const elapsed = Number(data.disabledAt) - Number(data.startTime);
      setBalanceState(elapsed * amountPerSec);
    } else {
      const amountPerSec =
        Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime)) / 10 ** data.tokenDecimals;
      const elapsed = Number(data.timestamp) - Number(data.startTime);
      setBalanceState(elapsed * amountPerSec + (now - data.timestamp) * amountPerSec);
    }
  }, [data]);
  React.useEffect(() => {
    const interval = setInterval(setState, 1);
    return () => clearInterval(interval);
  }, [setState]);

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
