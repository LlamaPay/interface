import * as React from 'react';
import type { IBalance } from '~/types';
import { useIntl } from 'next-intl';
import { useBalances } from '~/hooks';

interface BalanceAndSymbolProps {
  data: IBalance;
}

export const BalanceAndSymbol = ({ data }: BalanceAndSymbolProps) => {
  const ref = React.useRef<HTMLSpanElement>(null);

  const intl = useIntl();

  intl.formatNumber(499.9, { style: 'currency', currency: 'USD' });

  React.useEffect(() => {
    const interval = setInterval(() => {
      const delta = Date.now() / 1e3 - Number(data.lastPayerUpdate);
      const totalPaidSinceLastUpdate = (Number(data.totalPaidPerSec) / 1e20) * delta;
      const resultingAmount = Number(data.amount) - totalPaidSinceLastUpdate;
      if (ref.current && resultingAmount) {
        ref.current.innerText = `${intl.formatNumber(resultingAmount, {
          maximumFractionDigits: 5,
          minimumFractionDigits: 5,
        })} ${data.symbol}`;
      }
    }, 1);
    return () => clearInterval(interval);
  }, [data, intl]);

  return <span className="slashed-zero tabular-nums" ref={ref}></span>;
};

export const TokenBalance = ({ address, symbol }: { address: string; symbol: string }) => {
  const { balances } = useBalances();

  const data = balances?.find((b) => b.address === address);

  if (!data) return <>{`0.00000 ${symbol}`}</>;

  return <BalanceAndSymbol data={data} />;
};
