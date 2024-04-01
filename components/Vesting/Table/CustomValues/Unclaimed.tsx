import * as React from 'react';
import { useLocale } from '~/hooks';
import type { IVesting } from '~/types';

export default function Unclaimed({ data }: { data: IVesting }) {
  const { locale } = useLocale();
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const unclaimed = getTotalUnclaimed(data);
    let interval: any;
    if (unclaimed) {
      interval = setInterval(() => {
        if (ref.current) {
          ref.current.innerText = (getTotalUnclaimed(data) ?? '').toLocaleString(locale, {
            minimumFractionDigits: 5,
            maximumFractionDigits: 5,
          });
        }
      }, 1);
    }
    return () => clearInterval(interval);
  }, [data, locale]);
  return <span className="font-exo text-center slashed-zero tabular-nums dark:text-white" ref={ref}></span>;
}

const getTotalUnclaimed = (data: IVesting) => {
  if (Number(data.disabledAt) <= Date.now() / 1e3) {
    return Number(data.unclaimed) / 10 ** data.tokenDecimals;
  } else if (
    Date.now() / 1e3 > Number(data.endTime) ||
    Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)
  ) {
    return Number(data.unclaimed) / 10 ** data.tokenDecimals;
  } else {
    const amountPerSec =
      Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime)) / 10 ** data.tokenDecimals;

    return (
      Number(data.unclaimed) / Number(10 ** data.tokenDecimals) +
      amountPerSec * (Date.now() / 1e3 - Number(data.timestamp))
    );
  }
};
