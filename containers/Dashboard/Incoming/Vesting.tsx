import { useIntl, useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { vestingWithdrawableAmtFormatter } from '~/components/Vesting/Table/CustomValues/Unclaimed';
import { useMultipleTokenPrices } from '~/queries/useTokenPrice';
import { useGetVestingInfoByQueryParams } from '~/queries/vesting/useGetVestingInfo';
import { formatBalance } from '~/utils/amount';
import { Box } from '~/containers/common/Box';
import { pieChartBreakDown } from '~/containers/common/pieChartBreakdown';
import { VestingGraphic } from '~/containers/common/Graphics/Vesting';

export const Vesting = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  const { data, isLoading, isError } = useGetVestingInfoByQueryParams({ userAddress, chainId });

  const tokens =
    data?.reduce((acc, curr) => {
      if (curr.admin !== userAddress.toLowerCase()) {
        acc.add(curr.token.toLowerCase());
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
    const withdrawables = data ?? [];

    const id = setInterval(() => {
      if (data && totalClaimableRef.current) {
        totalClaimableRef.current.textContent =
          '$' +
          formatBalance(
            withdrawables.reduce((acc, curr) => {
              if (curr.admin === userAddress.toLowerCase()) {
                return acc;
              } else {
                acc +=
                  (tokenPrices[curr.token]?.price ?? 1) *
                  Number(
                    (
                      vestingWithdrawableAmtFormatter({
                        disabledAt: curr.disabledAt,
                        tokenDecimals: curr.tokenDecimals,
                        unclaimed: curr.unclaimed,
                        totalLocked: curr.totalLocked,
                        startTime: curr.startTime,
                        endTime: curr.endTime,
                        cliffLength: curr.cliffLength,
                        timestamp: curr.timestamp,
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
  }, [data, tokenPrices, userAddress, intl]);

  if (isLoading || isFetchingTokenPrices) {
    return <Box className="animate-shimmer-2 flex flex-col items-center justify-center"></Box>;
  }

  if (isError || data?.filter((x) => x.admin !== userAddress.toLowerCase())?.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center">
        <VestingGraphic />
        <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
          {isError ? t('errorFetchingData') : t('noActiveVestingStreams')}
        </p>
      </Box>
    );
  }

  return (
    <Box className="flex flex-col items-center justify-center">
      {data && (
        <>
          <div className={`h-16 w-16 rounded-full`} style={{ background: pieChartBreakDown(tokenPrices) }}></div>

          <p
            className="font-exo -my-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[4rem] font-extrabold slashed-zero tabular-nums text-llama-green-400 dark:text-llama-green-500"
            ref={totalClaimableRef}
          ></p>

          <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
            {t('claimableVestedTokens')}
          </p>
        </>
      )}
    </Box>
  );
};
