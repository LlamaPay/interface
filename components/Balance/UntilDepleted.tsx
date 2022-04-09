import React from 'react';
import { IBalance } from 'types';

interface UntilDepletedProps {
  data: IBalance;
}

function getTime(data: IBalance, balance: number) {
  const time = balance / (Number(data.totalPaidPerSec) / 10 ** (20 - Number(data.tokenDecimals)));
  if (Number(data.totalPaidPerSec) === 0) return 'No Streams';
  if (time < 1) return 'Streams Depleted';
  const days = Math.floor(time / 86400);
  const hours = Math.floor((time - days * 86400) / 3600);
  const minutes = Math.floor((time - days * 86400 - hours * 3600) / 60);
  const seconds = Math.floor(time - days * 86400 - hours * 3600 - minutes * 60);
  return `${days}D ${hours}H ${minutes}M ${seconds < 10 ? `0${seconds}` : seconds}S`;
}

export const UntilDepleted = ({ data }: UntilDepletedProps) => {
  const [balanceState, setBalanceState] = React.useState<number>(Number(data.amount));

  const updateBalance = React.useCallback(() => {
    const sub = Number(data.totalPaidPerSec) / 10 ** (20 - Number(data.tokenDecimals));
    setBalanceState((prevState) => prevState - sub);
  }, [data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return (
    <td className="whitespace-nowrap border p-1 text-right tabular-nums dark:border-stone-700">
      {getTime(data, balanceState)}
    </td>
  );
};
