import React from 'react';
import { IBalance } from 'types';

interface BalanceAndSymbolProps {
  data: IBalance;
}

export const BalanceAndSymbol = ({ data }: BalanceAndSymbolProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);

  const updateBalance = React.useCallback(() => {
    const sub = ((Date.now() / 1e3 - Number(data.lastPayerUpdate)) * Number(data.totalPaidPerSec)) / 1e20;
    setBalanceState(Number(data.amount) - sub);
  }, [data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 100);
    return () => clearInterval(interval);
  }, [updateBalance, data]);

  return (
    <td className="whitespace-nowrap border p-1 text-right slashed-zero tabular-nums dark:border-stone-700">
      {balanceState &&
        `${balanceState.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 })} ${
          data.symbol
        }`}
    </td>
  );
};
