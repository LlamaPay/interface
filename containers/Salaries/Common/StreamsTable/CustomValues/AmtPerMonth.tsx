import * as React from 'react';
import { useIntl, useTranslations } from 'next-intl';
import { secondsByDuration } from '~/utils/constants';
import { useTimeframeStore } from '~/store/timeframe';

// const timeframes = ['hour', 'day', 'week', 'month', 'year'];

export const AmtPerMonth = ({ data }: { data: number | string }) => {
  const timeframe = useTimeframeStore((state) => state.timeframe);
  const setTimeframe = useTimeframeStore((state) => state.setTimeframe);

  const t = useTranslations('Common');
  const intl = useIntl();

  function cycleTimeframe() {
    if (timeframe === 4) {
      setTimeframe(0);
    } else {
      setTimeframe(timeframe + 1);
    }
  }

  return (
    <button onClick={cycleTimeframe}>
      <span className="slashed-zero tabular-nums dark:text-white">
        {intl.formatNumber(
          timeframe === 0
            ? amtPerHourFormatter(data)
            : timeframe === 1
            ? amtPerDayFormatter(data)
            : timeframe === 2
            ? amtPerWeekFormatter(data)
            : timeframe === 4
            ? amtPerYearFormatter(data)
            : amtPerMonthFormatter(data),
          { maximumFractionDigits: 5 }
        )}
      </span>
      {/* <span className="mx-1 text-xs text-gray-500 dark:text-white">{`/ ${t('month')?.toLowerCase()}`}</span> */}
      <span className="mx-1 text-xs text-gray-500 dark:text-white">{`/ ${
        timeframe === 0
          ? 'hour'
          : timeframe === 1
          ? 'day'
          : timeframe === 2
          ? 'week'
          : timeframe === 4
          ? 'year'
          : t('month')?.toLowerCase()
      }`}</span>
    </button>
  );
};

export function amtPerHourFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['hour']) / 1e20;
}
export function amtPerDayFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['day']) / 1e20;
}
export function amtPerWeekFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['week']) / 1e20;
}
export function amtPerMonthFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['month']) / 1e20;
}
export function amtPerYearFormatter(amount: string | number): number {
  return (Number(amount) * secondsByDuration['year']) / 1e20;
}
