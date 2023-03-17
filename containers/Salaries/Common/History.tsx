import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { Box } from '~/containers/common/Box';
import { useGetSalaryHistoryInfo } from '~/queries/salary/useGetSalaryInfo';
import { HistoryTable } from './HistoryTable';

export function History({ userAddress, chainId }: { userAddress: string; chainId: number }) {
  const { data, isLoading, isError } = useGetSalaryHistoryInfo({ userAddress, chainId });

  const t = useTranslations('History');

  if (isLoading || isError || !data || data.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-exo text-3xl font-extrabold">{t('heading')}</h1>
        <Box className={classNames('grid min-h-[190px] items-center', isLoading && 'animate-shimmer-2')}>
          <p className="text-center text-llama-gray-400 dark:text-llama-gray-300">
            {isLoading ? '' : isError ? t('error') : t('noData')}
          </p>
        </Box>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-exo text-3xl font-extrabold">{t('heading')}</h1>
      <HistoryTable data={data} />
    </div>
  );
}
