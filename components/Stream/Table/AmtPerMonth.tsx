import { useTokenPrice } from 'queries/useTokenPrice';
import * as React from 'react';
import { IStream } from 'types';
import { secondsByDuration } from 'utils/constants';

const AmtPerMonth = ({ data }: { data: IStream }) => {
  const price = useTokenPrice(data.token.address.toLowerCase());
  const amount = (Number(data.amountPerSec) * secondsByDuration['month']) / 1e20;
  return (
    <div className="flex space-x-1">
      <span className="slashed-zero tabular-nums">{amount.toLocaleString('en-US', { maximumFractionDigits: 5 })}</span>
      <span className="text-[10px] slashed-zero tabular-nums">{(amount * Number(price.data)).toFixed(2)} USD</span>
    </div>
  );
};

export default AmtPerMonth;
