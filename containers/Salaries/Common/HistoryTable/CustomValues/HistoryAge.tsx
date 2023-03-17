import Tooltip from '~/components/Tooltip';
import { useChainExplorer } from '~/hooks';
import { useIntl } from 'next-intl';
import type { ISalaryHistory } from '~/queries/salary/useGetSalaryInfo';

export function eventAgeFormatter(timestamp: string): string {
  const timePassed = Date.now() / 1e3 - Number(timestamp);
  const days = Math.floor(timePassed / 86400);
  const hours = Math.floor((timePassed - 86400 * days) / 3600);
  const minutes = Math.floor((timePassed - 86400 * days - 3600 * hours) / 60);
  const seconds = Math.floor(timePassed - 86400 * days - 3600 * hours - minutes * 60);
  if (timePassed < 60) {
    return `${seconds.toString()} ${seconds === 1 ? 'sec' : 'secs'} ago`;
  } else if (timePassed >= 60 && timePassed < 3600) {
    return `${minutes.toString()} ${minutes === 1 ? 'min' : 'mins'} ago`;
  } else if (timePassed >= 3600 && timePassed < 86400) {
    return `${hours.toString()} ${hours === 1 ? 'hr' : 'hrs'} ago`;
  } else if (timePassed >= 86400) {
    return `${days.toString()} ${days === 1 ? 'day' : 'days'} ${hours.toString()} ${hours === 1 ? 'hr' : 'hrs'} ago`;
  } else {
    return '';
  }
}

export function HistoryAge({ data }: { data: ISalaryHistory }) {
  const { url, id } = useChainExplorer();
  const intl = useIntl();

  return (
    <>
      <Tooltip
        content={intl.formatDateTime(new Date(Number(data.createdTimestamp) * 1e3), {
          hour12: false,
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      >
        <a
          href={id === 82 || id === 1088 ? `${url}tx/${data.txHash}` : `${url}/tx/${data.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white"
        >
          {eventAgeFormatter(data.createdTimestamp)}
        </a>
      </Tooltip>
    </>
  );
}
