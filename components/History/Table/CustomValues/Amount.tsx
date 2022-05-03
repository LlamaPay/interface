import { useLocale } from 'hooks';
import { useTranslations } from 'next-intl';
import { IHistory } from 'types';
import { formatAmountInTable } from 'utils/amount';
import { secondsByDuration } from 'utils/constants';

export function Amount({ value, data }: { value: string; data: IHistory }) {
  const { locale } = useLocale();

  const t = useTranslations('Common');

  if (data.eventType === 'Deposit' || data.eventType === 'Withdraw' || data.eventType === 'PayerWithdraw') {
    return (
      <>
        <span>{`${(Number(data.amount) / 10 ** Number(data.token.decimals)).toLocaleString('en-US', {
          maximumFractionDigits: 5,
        })}`}</span>
        <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">{data.token.symbol}</span>
      </>
    );
  }

  const isDataValid = !Number.isNaN(value);

  const amount = isDataValid && formatAmountInTable(Number(value) / 1e20, secondsByDuration['month'], locale);

  const symbol = data?.stream?.token?.symbol ?? null;

  return (
    <>
      <span>{amount}</span>
      <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">
        {symbol} / {t('month')?.toLowerCase()}
      </span>
    </>
  );
}
