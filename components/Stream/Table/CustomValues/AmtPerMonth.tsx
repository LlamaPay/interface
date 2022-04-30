import Tooltip from 'components/Tooltip';
import { useLocale } from 'hooks';
import { useTokenPrice } from 'queries/useTokenPrice';
import * as React from 'react';
import { IStream } from 'types';
import { secondsByDuration } from 'utils/constants';

export const AmtPerMonth = ({ data }: { data: IStream }) => {
  const { data: price } = useTokenPrice(data.token.address.toLowerCase());
  const amount = (Number(data.amountPerSec) * secondsByDuration['month']) / 1e20;

  const { locale } = useLocale();

  return (
    <div className="flex justify-start">
      <Tooltip
        content={
          amount && price && `${(amount * Number(price)).toLocaleString(locale, { maximumFractionDigits: 5 })} USD`
        }
      >
        <span className="slashed-zero tabular-nums">{amount.toLocaleString(locale, { maximumFractionDigits: 5 })}</span>
      </Tooltip>
    </div>
  );
};
