import * as React from 'react';
import { useIntl } from 'next-intl';
import { IStream } from 'types';

export const TotalStreamed = ({ data }: { data: IStream }) => {
  const [amount, setAmount] = React.useState<string | null>(null);

  const intl = useIntl();

  React.useEffect(() => {
    const id = setInterval(() => {
      setAmount(intl.formatNumber(totalStreamedFormatter(data), { maximumFractionDigits: 5 }));
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data, intl]);

  return <p className="flex justify-start slashed-zero tabular-nums dark:text-white">{amount}</p>;
};

export function totalStreamedFormatter(data: IStream): number {
  if (data.paused) {
    return ((Number(data.lastPaused) - Number(data.createdTimestamp)) * Number(data.amountPerSec)) / 1e20;
  } else {
    return (
      (((Date.now() - Number(data.createdTimestamp) * 1000) / 1000) * Number(data.amountPerSec) -
        Number(data.pausedAmount)) /
      1e20
    );
  }
}
