import Tooltip from 'components/Tooltip';
import { useIntl } from 'next-intl';
import { IVesting } from 'types';
import { secondsByDuration } from 'utils/constants';

function getDate(data: IVesting, intl: any) {
  return intl.formatDateTime(new Date((Number(data.startTime) + Number(data.cliffLength)) * 1e3), { hour12: false });
}

export default function Status({ data }: { data: IVesting }) {
  const intl = useIntl();
  if (Date.now() / 1e3 < Number(data.startTime) + Number(data.cliffLength)) {
    const tilStart = ((Number(data.startTime) + Number(data.cliffLength) - Date.now() / 1e3) / 86400).toFixed(2);
    return (
      <div className="float-left">
        <Tooltip content={getDate(data, intl)}>
          <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{` Vesting Starts in ${tilStart} Days`}</span>
        </Tooltip>
      </div>
    );
  } else if (data.totalClaimed === data.totalLocked) {
    return (
      <div className="float-left">
        <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{`Vesting Ended`}</span>
      </div>
    );
  } else if (Number(data.disabledAt) <= Date.now() / 1e3) {
    return (
      <div className="float-left">
        <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{`Vesting Stopped by Admin`}</span>
      </div>
    );
  } else {
    const amtPerMonth: string = (
      (Number(data.totalLocked) / 10 ** Number(data.tokenDecimals) / (Number(data.endTime) - Number(data.startTime))) *
      secondsByDuration['month']
    ).toFixed(5);
    return (
      <div className="float-left">
        <span className="font-exo text-center slashed-zero tabular-nums dark:text-white">{`Vesting ${amtPerMonth}/month`}</span>
      </div>
    );
  }
}
