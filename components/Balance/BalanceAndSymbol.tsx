import React from 'react';
import Tooltip from 'components/Tooltip';
import { useTokenPrice } from 'queries/useTokenPrice';
import { IBalance } from 'types';
import { useIntl } from 'next-intl';

interface BalanceAndSymbolProps {
  data: IBalance;
}

export const BalanceAndSymbol = ({ data }: BalanceAndSymbolProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);

  const { data: price } = useTokenPrice(data.address);

  const intl = useIntl();

  intl.formatNumber(499.9, { style: 'currency', currency: 'USD' });

  const updateBalance = React.useCallback(() => {
    const sub = ((Date.now() / 1e3 - Number(data.lastPayerUpdate)) * Number(data.totalPaidPerSec)) / 1e20;
    setBalanceState(Number(data.amount) - sub);
  }, [data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1);
    return () => clearInterval(interval);
  }, [updateBalance, data]);

  return (
    <>
      <Tooltip content={balanceState && price && `${(balanceState * Number(price)).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">
          {balanceState &&
            `${intl.formatNumber(balanceState, { maximumFractionDigits: 5, minimumFractionDigits: 5 })} ${data.symbol}`}
        </span>
      </Tooltip>
    </>
  );
};
