import { useIntl, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { vestingWithdrawableAmtFormatter } from '~/components/Vesting/Table/CustomValues/Unclaimed';
import { useMultipleTokenPrices } from '~/queries/useTokenPrice';
import { useGetVestingInfoByQueryParams } from '~/queries/vesting/useGetVestingInfo';
import { formatBalance } from '~/utils/amount';
import { Box } from '~/containers/common/Box';
import { pieChartBreakDown } from '~/containers/common/pieChartBreakdown';
import { VestingGraphic } from '~/containers/common/Graphics/OutgoingVesting';
import { useLocale } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import Link from 'next/link';

export const Vesting = ({ userAddress, chainId }: { userAddress: string; chainId: number }) => {
  const [displayAltView, setDisplayAltView] = useState(false);
  const { data, isLoading, isError } = useGetVestingInfoByQueryParams({ userAddress, chainId });

  const tokens =
    data?.reduce((acc, curr) => {
      if (curr.admin === userAddress.toLowerCase()) {
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
  const { locale } = useLocale();
  const explorerLink = networkDetails[chainId]?.blockExplorerURL ?? null;

  useEffect(() => {
    const withdrawables = data ?? [];

    const id = setInterval(() => {
      if (data && totalClaimableRef.current) {
        totalClaimableRef.current.textContent =
          '$' +
          formatBalance(
            withdrawables.reduce((acc, curr) => {
              if (curr.admin === userAddress.toLowerCase()) {
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
              }

              return acc;
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

  if (isError || !data || data.filter((x) => x.admin === userAddress.toLowerCase())?.length === 0) {
    return (
      <Box className="flex flex-col items-center justify-center">
        {!isError && <VestingGraphic />}
        <p className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
          {isError ? t('errorFetchingData') : t('noActiveVestingStreams')}
        </p>
      </Box>
    );
  }

  const withdrawables = Object.entries(
    data?.reduce((acc, curr) => {
      if (curr.admin === userAddress.toLowerCase() && curr.unclaimed && curr.unclaimed !== '0') {
        acc[`outgoing+${curr.admin}+${curr.contract}+${curr.token}+${curr.tokenSymbol}`] = (
          Number(curr.unclaimed) /
          10 ** curr.tokenDecimals
        ).toLocaleString(locale, { maximumFractionDigits: 2 });
      }

      return acc;
    }, {} as { [key: string]: string })
  );

  return (
    <Box
      className={
        displayAltView
          ? 'flex flex-col flex-wrap justify-center gap-9 p-9 lg:flex-row'
          : 'flex flex-col items-center justify-center'
      }
      tabIndex={0}
      onMouseEnter={() => {
        setDisplayAltView(true);
      }}
      onMouseLeave={() => {
        setDisplayAltView(false);
      }}
      onFocus={() => {
        setDisplayAltView(true);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setDisplayAltView(false);
        }
      }}
    >
      {displayAltView ? (
        <>
          <div
            className={`h-[200px] w-[200px] flex-shrink-0 rounded-full`}
            style={{ background: pieChartBreakDown(tokenPrices) }}
          ></div>

          <div className="flex flex-1 flex-shrink-0 flex-col gap-4">
            <h1 className="text-sm font-medium text-llama-gray-400 dark:text-llama-gray-300">
              {t('vestedTokenExpense')}
            </h1>

            <ul className="w-full">
              {withdrawables.map((withdrawable) => (
                <li
                  key={withdrawable[0]}
                  className="flex flex-wrap items-center justify-between gap-2 text-xl md:flex-nowrap"
                >
                  {explorerLink ? (
                    <a
                      target="_blank"
                      rel="noreferrer noopener"
                      href={`${explorerLink}/address/${withdrawable[0].split('+')[3]}`}
                    >
                      {withdrawable[0].split('+')[4]}
                    </a>
                  ) : (
                    <span>{withdrawable[0].split('+')[4]}</span>
                  )}

                  <span>{withdrawable[1]}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/outgoing/vesting"
              className="rounded-lg border border-opacity-10 py-2 px-4 text-center text-sm font-semibold text-llama-gray-900 shadow-[0px_2px_5px_rgba(48,61,49,0.06)] dark:border-lp-gray-7 dark:text-white"
            >
              {t('viewAllVesting')}
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className={`h-16 w-16 rounded-full`} style={{ background: pieChartBreakDown(tokenPrices) }}></div>

          <p
            className="font-exo -my-2 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[4rem] font-extrabold slashed-zero tabular-nums text-llama-green-400 dark:text-llama-green-500"
            ref={totalClaimableRef}
          ></p>

          <h1 className="text-base font-medium text-llama-gray-400 dark:text-llama-gray-300">
            {t('vestedTokenExpense')}
          </h1>
        </>
      )}
    </Box>
  );
};
