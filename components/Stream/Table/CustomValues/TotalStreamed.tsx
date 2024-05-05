import * as React from 'react';
import { useIntl } from 'next-intl';
import type { IStream } from '~/types';

export const TotalStreamed = ({ data }: { data: IStream }) => {
  const ref = React.useRef<HTMLParagraphElement>(null);

  const intl = useIntl();

  React.useEffect(() => {
    const id = setInterval(() => {
      if (ref.current) {
        ref.current.innerText = intl.formatNumber(totalStreamedFormatter(data), { maximumFractionDigits: 5 });
      }
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [data, intl]);

  return <p className="flex justify-start slashed-zero tabular-nums dark:text-white" ref={ref}></p>;
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
