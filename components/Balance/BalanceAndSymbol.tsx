import Tooltip from 'components/Tooltip';
import { useTokenPrice } from 'queries/useTokenPrice';
import React from 'react';
import { IBalance } from 'types';

interface BalanceAndSymbolProps {
  data: IBalance;
}

export const BalanceAndSymbol = ({ data }: BalanceAndSymbolProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const price = useTokenPrice(data.address);

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
    <td className="whitespace-nowrap border px-4 py-[6px] text-right text-sm dark:border-stone-700">
      <Tooltip content={`${balanceState && (balanceState * Number(price.data)).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">
          {balanceState &&
            `${balanceState.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 })} ${
              data.symbol
            }`}
        </span>
      </Tooltip>
    </td>
  );
};
