import React from 'react';
import { IVesting } from 'types';

export default function Unclaimed({ data, dataType }: { data: IVesting; dataType: string }) {
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    return <span className="text-center dark:text-white">{'Still In Cliff'}</span>;
  }

  return (
    <span className="text-center dark:text-white">
      {dataType === 'unclaimed'
        ? (Number(data.unclaimed) / 10 ** data.tokenDecimals).toFixed(5)
        : (Number(data.totalClaimed) / 10 ** data.tokenDecimals).toFixed(5)}
    </span>
  );
}
