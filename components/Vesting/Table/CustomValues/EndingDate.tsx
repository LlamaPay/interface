import Tooltip from 'components/Tooltip';
import { useIntl } from 'next-intl';
import { IVesting } from 'types';

function getDate(data: IVesting, intl: any) {
  return intl.formatDateTime(new Date(Number(data.endTime) * 1e3), { hour12: false });
}

export default function EndingDate({ data }: { data: IVesting }) {
  const intl = useIntl();
  const tilEnd = ((Number(data.endTime) - Date.now() / 1e3) / 86400).toFixed(2);
  return (
    <div className="float-left">
      <Tooltip content={getDate(data, intl)}>
        <span className="font-exo text-center dark:text-white">{`In ${tilEnd} days`}</span>
      </Tooltip>
    </div>
  );
}
