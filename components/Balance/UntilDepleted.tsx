import React from 'react';
import { IBalance } from 'types';

interface UntilDepletedProps {
  data: IBalance;
}

function getTime(data: IBalance, balance: number, mouseHover: boolean) {
  const time = balance / (Number(data.totalPaidPerSec) / 1e20);
  if (mouseHover) {
    return new Date(Date.now() + time * 1e3).toLocaleString('en-CA', {
      hour12: false,
      dateStyle: 'short',
      timeStyle: 'short',
    });
  }
  if (Number(data.totalPaidPerSec) === 0) return 'No Streams';
  if (time < 1) return 'Streams Depleted';
  const days = time / 86400;
  return `${days.toFixed(2)} days`;
}

export const UntilDepleted = ({ data }: UntilDepletedProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const [mouseHover, setMouseHover] = React.useState<boolean>(false);

  const updateBalance = React.useCallback(() => {
    const sub = ((Date.now() / 1e3 - Number(data.lastPayerUpdate)) * Number(data.totalPaidPerSec)) / 1e20;
    setBalanceState(Number(data.amount) - sub);
  }, [data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  const handleMouse = React.useCallback(() => {
    setMouseHover(!mouseHover);
  }, [mouseHover]);

  return (
    <td
      className="whitespace-nowrap border px-4 py-[6px] text-sm tabular-nums dark:border-stone-700"
      onMouseEnter={handleMouse}
      onMouseLeave={handleMouse}
    >
      {balanceState && getTime(data, balanceState, mouseHover)}
    </td>
  );
};
