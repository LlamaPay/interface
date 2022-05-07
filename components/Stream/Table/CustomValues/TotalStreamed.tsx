import * as React from 'react';
import { useIntl } from 'next-intl';
import { IStream } from 'types';

export const TotalStreamed = ({ data }: { data: IStream }) => {
  const [amount, setAmount] = React.useState<string | null>(null);

  const intl = useIntl();

  React.useEffect(() => {
    const id = setInterval(() => {
      if (data.paused) {
        const totalAmount =
          ((Number(data.lastPaused) - Number(data.createdTimestamp)) * Number(data.amountPerSec)) / 1e20;
        setAmount(intl.formatNumber(totalAmount, { maximumFractionDigits: 5 }));
      } else {
        const totalAmount =
          (((Date.now() - Number(data.createdTimestamp) * 1000) / 1000) * Number(data.amountPerSec) -
            Number(data.pausedAmount)) /
          1e20;
        setAmount(intl.formatNumber(totalAmount, { maximumFractionDigits: 5, minimumFractionDigits: 5 }));
      }
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data, intl]);

  return <p className="flex justify-start slashed-zero tabular-nums">{amount}</p>;
};
