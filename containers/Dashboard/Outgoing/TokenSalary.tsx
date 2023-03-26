import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Box } from '~/containers/common/Box';
import { currentYear, daysInMonth, months, yearOptions } from '~/containers/common/date';
import { SalaryGraphic } from '~/containers/common/Graphics/OutgoingSalary';
import { useLocale } from '~/hooks';
import { useGetScheduledTransferPoolsOnAllChains } from '~/queries/tokenSalary/useGetScheduledTransfers';
import type { IScheduledTransferPayment } from '~/queries/tokenSalary/useGetScheduledTransfers';

export const TokenSalary = ({ userAddress }: { userAddress: string }) => {
  const t0 = useTranslations('Dashboard');
  const t1 = useTranslations('Months');
  const [year, setYear] = useState(currentYear);

  const { data: pools, isLoading, isError } = useGetScheduledTransferPoolsOnAllChains({ userAddress });

  const tags: { [year: number]: { [month: number]: { [day: number]: number } } } = {};

  const poolPayments =
    pools?.reduce((acc, curr) => {
      curr.payments.forEach((item) => {
        acc = [...acc, item];
      });
      return acc;
    }, [] as Array<IScheduledTransferPayment>) ?? [];

  poolPayments?.forEach((item) => {
    const remainingTxs = (Number(item.ends) - Number(item.lastPaid)) / Number(item.frequency);

    if (remainingTxs > 0) {
      for (let i = 1; i < remainingTxs && i < 160; i++) {
        const release = new Date((Number(item.lastPaid) + Number(item.frequency) * i) * 1000);
        const year = release.getFullYear();
        const month = release.getMonth();
        const day = release.getDate();

        tags[year] = {
          ...(tags[year] || {}),
          [month]: {
            ...(tags[year]?.[month] ?? {}),
            [day]: (tags[year]?.[month]?.[day] ?? 0) + (+item.usdAmount || 0),
          },
        };
      }
    }
  });

  const { locale } = useLocale();

  if (isLoading) {
    return <Box className="animate-shimmer-2 isolate col-span-full flex min-h-[300px] flex-col gap-3"></Box>;
  }

  if (
    isError ||
    poolPayments?.filter((x) => (Number(x.ends) - Number(x.lastPaid)) / Number(x.frequency) > 0)?.length === 0
  ) {
    return (
      <Box className="isolate col-span-full flex min-h-[300px] flex-col items-center justify-center">
        {!isError && <SalaryGraphic />}
        <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
          {isError ? t0('errorFetchingData') : t0('noPendingTokenSalaries')}
        </p>
      </Box>
    );
  }

  return (
    <Box className="isolate col-span-full flex min-h-[300px] flex-col gap-3">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-sm font-medium text-llama-gray-400 dark:text-llama-gray-300">{t0('tokenSalaries')}</h1>
        <select
          name="year"
          className="border-0 bg-[#FCFFFE] py-0 text-sm font-medium text-llama-gray-400 dark:bg-[#141414] dark:text-llama-gray-300"
          onChange={(e) => setYear(Number(e.target.value))}
          value={year}
        >
          {yearOptions.map((year) => (
            <option value={year} key={'outgoing token salaries year' + year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {Object.values(tags?.[year] ?? {}).length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <SalaryGraphic />
          <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
            {t0('noPendingTokenSalaries')}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-nowrap gap-1 overflow-x-auto p-3">
          {months.map(([id, month]) => (
            <div key={`outgoing token salary ${year} ${id} ${month}`} className="relative flex flex-1 flex-col gap-1">
              <div className="flex flex-1 flex-nowrap gap-[1px]">
                {new Array(daysInMonth(String(id), String(year))).fill(0).map((_x, day) => (
                  <div
                    key={`outgoing token salaries by month ${id} ${month} ${day + 1} ${year}`}
                    className="relative flex-1 border border-transparent"
                  >
                    {tags?.[year]?.[id]?.[day + 1] && (
                      <>
                        <div
                          className="relative rounded-lg border border-black border-opacity-5 bg-[#FCFFFE] p-3 dark:border-white dark:bg-black"
                          style={{ top: `${((day % 2) + 1) * 15}%` }}
                          tabIndex={0}
                        >
                          <p className="whitespace-nowrap text-sm font-medium text-[#A1A2AA]">{`${t1(month)} ${
                            day + 1
                          }, ${year}`}</p>
                          <p className="text-sm font-medium text-black dark:text-white">
                            {tags?.[year]?.[id]?.[day + 1]
                              ? `$${(tags?.[year]?.[id]?.[day + 1] / 1e8).toLocaleString(locale, {
                                  maximumFractionDigits: 2,
                                })}`
                              : ''}
                          </p>
                        </div>
                        <div className="absolute top-0 bottom-0 left-2/4 right-2/4 -z-10 border border-black border-opacity-5 dark:border-white"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs font-medium text-[#A1A2AA]">{t1(month)}</p>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};
