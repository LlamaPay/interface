import { useLocale } from '~/hooks';
import { IVesting } from '~/types';
import * as React from 'react';

export default function Vested({ data }: { data: IVesting }) {
  const { locale } = useLocale();
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const vested = getTotalVested(data) / 10 ** data.tokenDecimals;
    let interval: any;
    if (vested) {
      interval = setInterval(() => {
        if (ref.current) {
          ref.current.innerText = (getTotalVested(data) / 10 ** data.tokenDecimals ?? '').toLocaleString(locale, {
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

export const getTotalVested = (data: IVesting) => {
  const now = Date.now() / 1e3;
  if (Number(data.startTime) >= now) {
    return 0;
  } else if (now >= Number(data.disabledAt) && data.disabledAt === data.endTime) {
    return Number(data.totalLocked);
  } else if (now >= Number(data.disabledAt)) {
    const amountPerSec = Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime));
    const elapsed = Number(data.disabledAt) - Number(data.startTime);
    return elapsed * amountPerSec;
  } else {
    const amountPerSec = Number(data.totalLocked) / (Number(data.endTime) - Number(data.startTime));
    const elapsed = Number(data.timestamp) - Number(data.startTime);
    return elapsed * amountPerSec + (now - data.timestamp) * amountPerSec;
  }
};
