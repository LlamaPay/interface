import React from 'react';
import { IVesting } from 'types';

export default function Unclaimed({ data }: { data: IVesting }) {
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    const tilCliff = ((Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
    return <span className="text-center dark:text-white">{`Cliff Ends In ${tilCliff} days`}</span>;
  }

  return (
    <span className="text-center dark:text-white">
      {`${(Number(data.unclaimed) / 10 ** data.tokenDecimals).toFixed(5)} ${data.tokenSymbol}`}
    </span>
  );
}
