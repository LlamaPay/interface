import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { Box } from '~/containers/common/Box';
import { useGetSalaryInfo } from '~/queries/salary/useGetSalaryInfo';
import { StreamTable } from './StreamsTable';

export function AllIncomeStreams({
  userAddress,
  chainId,
  isIncoming,
}: {
  userAddress: string;
  chainId: number;
  isIncoming?: boolean;
}) {
  const { data, isLoading, isError } = useGetSalaryInfo({ userAddress, chainId });

  const t = useTranslations('Dashboard');

  const streams =
    data?.salaryStreams?.filter((x) =>
      isIncoming ? x.payerAddress !== userAddress.toLowerCase() : x.payerAddress === userAddress.toLowerCase()
    ) ?? [];

  if (isLoading || isError || streams.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-exo text-3xl font-extrabold">{t('allIncomeStreams')}</h1>
        <Box className={classNames('grid min-h-[190px] items-center', isLoading && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {isLoading ? '' : isError ? t('errorFetchingData') : t('noActiveSalaryStreams')}
          </p>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">{t('allIncomeStreams')}</h1>
      <StreamTable data={streams} />
    </div>
  );
}
