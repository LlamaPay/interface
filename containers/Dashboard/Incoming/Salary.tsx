import { useIntl, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { withdrawableAmtFormatter } from '~/components/Stream/Table/CustomValues';
import { useClaimableSalary } from '~/queries/salary/useClaimableSalary';
import { formatBalance } from '~/utils/amount';
import { Box } from '../shared/Box';

const pieColors = ['#22C497', '#46E8CA', '#9D42D5', '#EEB626', '#22B1C4'];

export const Salary = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  const { data, isLoading, isError } = useClaimableSalary({ userAddress, chainId });

  const totalClaimableRef = useRef<HTMLParagraphElement>(null);
  const intl = useIntl();

  const t = useTranslations('Dashboard');

  useEffect(() => {
    const tokenPrices = data?.tokenPrices ?? {};
    const withdrawables = data?.withdrawables ?? [];

    const id = setInterval(() => {
      if (data && totalClaimableRef.current) {
        totalClaimableRef.current.textContent =
          '$' +
          formatBalance(
            withdrawables.reduce((acc, curr) => {
              acc +=
                (tokenPrices[curr.token.address] || 1) *
                Number(
                  (
                    withdrawableAmtFormatter({
                      amountPerSec: curr.amountPerSec,
                      decimals: curr.token.decimals,
                      withdrawableAmount: curr.withdrawableAmount as any,
                      owed: curr.owed as any,
                      lastUpdate: curr.lastUpdate as any,
                    }) || 0
                  ).toFixed(4)
                );

              return acc;
            }, 0),
            intl,
            2
          );
      }
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data, intl]);

  const pieChartBreakDown =
    'conic-gradient(' +
    Object.keys(data?.tokenPrices ?? {})
      .map((_x, index) => `${pieColors[index] || pieColors[4]} ${100 / Object.keys(data?.tokenPrices ?? {}).length}%`)
      .join(',') +
    ',black)';

  return (
    <Box className="flex flex-col items-center justify-center">
      <div className={`h-16 w-16 rounded-full`} style={{ background: pieChartBreakDown }}></div>
      <p
        className="font-exo -my-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[4rem] font-extrabold slashed-zero tabular-nums text-llama-green-400 dark:text-llama-green-500"
        ref={totalClaimableRef}
      ></p>
      <p className="text-lg font-medium text-llama-gray-400">{t('claimableSalary')}</p>
    </Box>
  );
};
