import * as React from 'react';
import { useIntl, useTranslations } from 'next-intl';
import { IStream } from 'types';
import { secondsByDuration } from 'utils/constants';

export const AmtPerMonth = ({ data }: { data: IStream }) => {
  const amount = (Number(data.amountPerSec) * secondsByDuration['month']) / 1e20;

  const t = useTranslations('Common');

  const intl = useIntl();

  return (
    <>
      <span className="slashed-zero tabular-nums">{intl.formatNumber(amount, { maximumFractionDigits: 5 })}</span>
      <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">{`/ ${t('month')?.toLowerCase()}`}</span>
    </>
  );
};
