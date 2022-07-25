import * as React from 'react';
import { useIntl, useTranslations } from 'next-intl';
import { secondsByDuration } from 'utils/constants';

export const AmtPerMonth = ({ data }: { data: number }) => {
  const t = useTranslations('Common');

  const intl = useIntl();

  return (
    <>
      <span className="slashed-zero tabular-nums dark:text-white">
        {intl.formatNumber(data, { maximumFractionDigits: 5 })}
      </span>
      <span className="mx-1 text-xs text-gray-500 dark:text-white">{`/ ${t('month')?.toLowerCase()}`}</span>
    </>
  );
};

export function amtPerMonthFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['month']) / 1e20;
}
