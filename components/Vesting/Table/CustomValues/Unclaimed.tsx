import Tooltip from 'components/Tooltip';
import React from 'react';
import { IVesting } from 'types';
import { useIntl } from 'next-intl';

function getDate(data: IVesting, intl: any) {
  return intl.formatDateTime(new Date((Number(data.startTime) + Number(data.cliffLength)) * 1e3), { hour12: false });
}

export default function Unclaimed({ data }: { data: IVesting }) {
  const intl = useIntl();
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    const tilCliff = ((Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
    return (
      <Tooltip content={getDate(data, intl)}>
        <span className="font-exo dark:text-white">{`Cliff Ends In ${tilCliff} days`}</span>
      </Tooltip>
    );
  }

  return (
    <span className="font-exo text-center dark:text-white">
      {`${(Number(data.unclaimed) / 10 ** data.tokenDecimals).toFixed(5)} ${data.tokenSymbol}`}
    </span>
  );
}
