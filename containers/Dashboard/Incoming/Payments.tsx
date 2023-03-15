import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { Box } from '~/containers/common/Box';
import { currentYear, daysInMonth, months, yearOptions } from '~/containers/common/date';
import { PaymentsGraphic } from '~/containers/common/Graphics/Payments';
import { useLocale } from '~/hooks';
import { useGetPaymentsInfo } from '~/queries/payments/useGetPaymentsInfo';
import { useMultipleTokenPrices } from '~/queries/useTokenPrice';

export const Payments = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  const t0 = useTranslations('Dashboard');
  const t1 = useTranslations('Months');
  const [year, setYear] = useState(currentYear);

  const { data, isLoading, isError } = useGetPaymentsInfo({ userAddress, chainId });

  const tokens =
    data?.reduce((acc, curr) => {
      if (curr.payer !== userAddress.toLowerCase()) {
        acc.add(curr.tokenAddress.toLowerCase());
      }
      return acc;
    }, new Set<string>()) ?? new Set();

  const { data: tokenPrices, isLoading: isFetchingTokenPrices } = useMultipleTokenPrices({
    tokens: Array.from(tokens),
  });

  const tags: { [year: number]: { [month: number]: { [day: number]: number } } } = {};

  data?.forEach((item) => {
    if (item.payer !== userAddress.toLowerCase() && Number(item.release) > Date.now() / 1000 && !item.revoked) {
      const release = new Date(item.release * 1000);
      const year = release.getFullYear();
      const month = release.getMonth();
      const day = release.getDate();

      tags[year] = {
        ...(tags[year] || {}),
        [month]: {
          ...(tags[year]?.[month] ?? {}),
          [day]:
            (tags[year]?.[month]?.[day] ?? 0) +
            (item.amount / 10 ** item.tokenDecimals) * (tokenPrices?.[item.tokenAddress]?.price ?? 1),
        },
      };
    }
  });

  const { locale } = useLocale();

  if (isLoading || isFetchingTokenPrices) {
    return <Box className="animate-shimmer-2 isolate col-span-full flex min-h-[300px] flex-col gap-3"></Box>;
  }

  if (
    isError ||
    data?.filter((x) => x.payer !== userAddress.toLowerCase() && !x.revoked && x.release > Date.now() / 1000)
      ?.length === 0
  ) {
    return (
      <Box className="isolate col-span-full flex min-h-[300px] flex-col items-center justify-center">
        <PaymentsGraphic />
        <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
          {isError ? t0('errorFetchingData') : t0('noPendingOneTimePayments')}
        </p>
      </Box>
    );
  }

  return (
    <Box className="isolate col-span-full flex min-h-[300px] flex-col gap-3" tabIndex={0}>
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-llama-gray-400 dark:text-llama-gray-300">{t0('scheduledPayments')}</p>
        <select
          name="year"
          className="border-0 bg-[#FCFFFE] py-0 text-sm font-medium text-llama-gray-400 dark:bg-[#141414] dark:text-llama-gray-300"
          onChange={(e) => setYear(Number(e.target.value))}
          value={year}
        >
          {yearOptions.map((year) => (
            <option value={year} key={'scheduled payments year' + year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {Object.values(tags?.[year] ?? {}).length === 0 ? (
        <div className="flex flex-col items-center justify-center">
          <PaymentsGraphic />
          <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
            {t0('noPendingOneTimePayments')}
          </p>
        </div>
      ) : (
        <div className="flex flex-1 flex-nowrap gap-1 overflow-x-auto p-3">
          {months.map(([id, month]) => (
            <div key={`scheduled payment ${year} ${id} ${month}`} className="relative flex flex-1 flex-col gap-1">
              <div className="flex flex-1 flex-nowrap gap-[1px]">
                {new Array(daysInMonth(String(id), String(year))).fill(0).map((_x, day) => (
                  <div
                    key={`scheduled payments by month ${id} ${month} ${day + 1} ${year}`}
                    className="relative flex-1 border border-transparent"
                  >
                    {tags?.[year]?.[id]?.[day + 1] && (
                      <>
                        <div
                          className="relative rounded-lg border border-black border-opacity-5 bg-[#FCFFFE] p-3 dark:border-white dark:bg-black"
                          style={{ top: `${((day % 2) + 1) * 15}%` }}
                        >
                          <p className="whitespace-nowrap text-sm font-medium text-[#A1A2AA]">{`${t1(month)} ${
                            day + 1
                          }, ${year}`}</p>
                          <p className="text-sm font-medium text-black dark:text-white">
                            {tags?.[year]?.[id]?.[day + 1]
                              ? `$${(tags?.[year]?.[id]?.[day + 1]).toLocaleString(locale, {
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
