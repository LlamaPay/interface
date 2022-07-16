import Tooltip from 'components/Tooltip';
import { useIntl } from 'next-intl';
import { IVesting } from 'types';
import { secondsByDuration } from 'utils/constants';

export default function Status({ data }: { data: IVesting }) {
  const intl = useIntl();

  const value = (
    <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{getStatus(data)}</span>
  );

  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    return (
      <div className="float-left">
        <Tooltip content={getDate(data, intl)}>{value}</Tooltip>
      </div>
    );
  }

  return <div className="float-left">{value}</div>;
}

function getDate(data: IVesting, intl: any) {
  return intl.formatDateTime(new Date((Number(data.startTime) + Number(data.cliffLength)) * 1e3), { hour12: false });
}

export function getStatus(data: IVesting) {
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    const tilStart = ((Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
    return `Vesting Starts in ${tilStart} Days`;
  } else if (data.totalClaimed === data.totalLocked) {
    return `Vesting Ended`;
  } else if (Number(data.disabledAt) <= Date.now() / 1e3) {
    return `Vesting Stopped by Admin`;
  } else {
    const amtPerMonth: string = (
      (Number(data.totalLocked) / 10 ** Number(data.tokenDecimals) / (Number(data.endTime) - Number(data.startTime))) *
      secondsByDuration['month']
    ).toFixed(5);
    return `Vesting ${amtPerMonth}/month`;
  }
}

export function statusAccessorFn(data: IVesting) {
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    const tilStart = ((Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
    // `Vesting Starts in ${tilStart} Days`
    return tilStart;
  } else if (data.totalClaimed === data.totalLocked) {
    // `Vesting Ended`
    return -1;
  } else if (Number(data.disabledAt) <= Date.now() / 1e3) {
    // `Vesting Stopped by Admin`
    return -1;
  } else {
    // `Vesting ${amtPerMonth}/month`
    return 0;
  }
}
