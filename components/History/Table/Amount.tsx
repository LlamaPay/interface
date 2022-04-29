import { useLocale } from 'hooks';
import { IHistory } from 'types';
import { formatAmountInTable } from 'utils/amount';
import { secondsByDuration } from 'utils/constants';

export default function Amount({ value, data }: { value: string; data?: IHistory }) {
  const isDataValid = !Number.isNaN(value);
  const { locale } = useLocale();

  const amount = isDataValid && formatAmountInTable(Number(value) / 1e20, secondsByDuration['month'], locale);

  const symbol = data?.stream?.token?.symbol ?? null;

  return (
    <>
      <span>{amount}</span>
      <span className="mx-1 text-xs text-gray-500 dark:text-gray-400">{symbol} / month</span>
    </>
  );
}
