import Tooltip from 'components/Tooltip';
import { useTokenPrice } from 'queries/useTokenPrice';
import * as React from 'react';
import { IStream } from 'types';
import { secondsByDuration } from 'utils/constants';

const AmtPerMonth = ({ data }: { data: IStream }) => {
  const { data: price } = useTokenPrice(data.token.address.toLowerCase());
  const amount = (Number(data.amountPerSec) * secondsByDuration['month']) / 1e20;
  return (
    <div className="flex items-baseline space-x-1">
      <Tooltip content={`${amount && price && `${(amount * Number(price)).toFixed(2)} USD`}`}>
        <span className="slashed-zero tabular-nums">
          {amount.toLocaleString('en-US', { maximumFractionDigits: 5 })}
        </span>
      </Tooltip>
    </div>
  );
};

export default AmtPerMonth;
