import React from 'react';
import Tooltip from 'components/Tooltip';
import { IBalance } from 'types';
import { useIntl, useTranslations } from 'next-intl';

interface UntilDepletedProps {
  data: IBalance;
}

function getTime(data: IBalance, balance: number, t: (a: string) => string) {
  const time = balance / (Number(data.totalPaidPerSec) / 1e20);

  if (Number(data.totalPaidPerSec) === 0) return t('noStreams');

  if (time < 1) return t('streamsDepleted');

  const days = time / 86400;

  return `${days.toFixed(2)} ${t('days')}`;
}

function getDate(data: IBalance, balance: number, intl: any) {
  const time = balance / (Number(data.totalPaidPerSec) / 1e20);

  if (time < 1) return '';

  if (Number(data.totalPaidPerSec) === 0) return '';

  return intl.formatDateTime(new Date(Date.now() + time * 1e3), { hour12: false });
}

export const UntilDepleted = ({ data }: UntilDepletedProps) => {
  const [balanceState, setBalanceState] = React.useState<number | null>(null);

  const t = useTranslations('Balances');

  const intl = useIntl();

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

  return (
    <>
      {balanceState && <Tooltip content={getDate(data, balanceState, intl)}>{getTime(data, balanceState, t)}</Tooltip>}
    </>
  );
};
