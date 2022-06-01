import React from 'react';
import { IVesting } from 'types';

export default function Unclaimed({ data }: { data: IVesting }) {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const setState = React.useCallback(() => {
    if (
      Date.now() / 1e3 > Number(data.endTime) ||
      Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)
    ) {
      setBalanceState(Number(data.unclaimed) / 10 ** data.tokenDecimals);
    } else {
      const amountPerSec =
        Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime)) / 10 ** data.tokenDecimals;
      setBalanceState(
        Number(data.unclaimed) / 10 ** data.tokenDecimals + (Date.now() / 1e3 - data.timestamp) * amountPerSec
      );
    }
  }, [data]);

  React.useEffect(() => {
    const interval = setInterval(setState, 1);
    return () => clearInterval(interval);
  }, [setState]);

  return (
    <span className="font-exo text-center dark:text-white">{`${balanceState?.toFixed(5)} ${data.tokenSymbol}`}</span>
  );
}
