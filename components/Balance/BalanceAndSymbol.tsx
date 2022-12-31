import * as React from 'react';
import type { IBalance } from '~/types';
import { useIntl } from 'next-intl';
import { useBalances } from '~/hooks';

interface BalanceAndSymbolProps {
  data: IBalance;
}

export const BalanceAndSymbol = ({ data }: BalanceAndSymbolProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);

  const intl = useIntl();

  intl.formatNumber(499.9, { style: 'currency', currency: 'USD' });

  const updateBalance = React.useCallback(() => {
    const delta = Date.now() / 1e3 - Number(data.lastPayerUpdate);
    const totalPaidSinceLastUpdate = (Number(data.totalPaidPerSec) / 1e20) * delta;
    const resultingAmount = Number(data.amount) - totalPaidSinceLastUpdate;
    setBalanceState(resultingAmount);
  }, [data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1);
    return () => clearInterval(interval);
  }, [updateBalance, data]);

  return (
    <span className="slashed-zero tabular-nums">
      {balanceState &&
        `${intl.formatNumber(balanceState, { maximumFractionDigits: 5, minimumFractionDigits: 5 })} ${data.symbol}`}
    </span>
  );
};

export const TokenBalance = ({ address, symbol }: { address: string; symbol: string }) => {
  const { balances } = useBalances();

  const data = balances?.find((b) => b.address === address);

  if (!data) return <>{`0.00000 ${symbol}`}</>;

  return <BalanceAndSymbol data={data} />;
};
