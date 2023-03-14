import { useIntl, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { salaryWithdrawableAmtFormatter } from '~/components/Stream/Table/CustomValues';
import { useGetSalaryInfo } from '~/queries/salary/useGetSalaryInfo';
import { useMultipleTokenPrices } from '~/queries/useTokenPrice';
import { formatBalance } from '~/utils/amount';
import { Box } from '~/containers/common/Box';
import { pieChartBreakDown } from '~/containers/common/pieChartBreakdown';

export const Salary = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  const { data } = useGetSalaryInfo({ userAddress, chainId });

  const tokens =
    data?.reduce((acc, curr) => {
      if (curr.payerAddress !== userAddress.toLowerCase()) {
        acc.add(curr.token.address.toLowerCase());
      }
      return acc;
    }, new Set<string>()) ?? new Set();

  const { data: tokenPrices, isLoading: isFetchingTokenPrices } = useMultipleTokenPrices({
    tokens: Array.from(tokens),
  });

  const totalClaimableRef = useRef<HTMLParagraphElement>(null);
  const intl = useIntl();

  const t = useTranslations('Dashboard');

  useEffect(() => {
    const id = setInterval(() => {
      if (data && totalClaimableRef.current) {
        totalClaimableRef.current.textContent =
          '$' +
          formatBalance(
            data.reduce((acc, curr) => {
              if (curr.payerAddress === userAddress.toLowerCase()) {
                return acc;
              } else {
                acc +=
                  (tokenPrices[curr.token.address]?.price ?? 1) *
                  Number(
                    (
                      salaryWithdrawableAmtFormatter({
                        amountPerSec: curr.amountPerSec,
                        decimals: curr.token.decimals,
                        withdrawableAmount: curr.withdrawableAmount as any,
                        owed: curr.owed as any,
                        lastUpdate: curr.lastUpdate as any,
                      }) || 0
                    ).toFixed(4)
                  );

                return acc;
              }
            }, 0),
            intl,
            2
          );
      }
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data, userAddress, tokenPrices, intl]);

  return (
    <Box className="flex flex-col items-center justify-center">
      {data && !isFetchingTokenPrices && (
        <>
          <div className={`h-16 w-16 rounded-full`} style={{ background: pieChartBreakDown(tokenPrices) }}></div>
          <p
            className="font-exo -my-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[4rem] font-extrabold slashed-zero tabular-nums text-llama-green-400 dark:text-llama-green-500"
            ref={totalClaimableRef}
          ></p>
          <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">{t('claimableSalary')}</p>
        </>
      )}
    </Box>
  );
};
