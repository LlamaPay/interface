import * as React from 'react';
import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import { FormDialog } from '~/components/Dialog';
import { useChainExplorer } from '~/hooks';
import { useIntl, useTranslations } from 'next-intl';
import type { IFormattedSalaryStream } from '~/types';

interface StreamHistoryProps {
  data: IFormattedSalaryStream;
  className?: string | boolean;
}

export const StreamHistory = ({ data, className }: StreamHistoryProps) => {
  const historicalData = data.historicalEvents;

  const dialog = useDialogState();

  const { url: chainExplorer, name: explorerName, id } = useChainExplorer();

  const intl = useIntl();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('History');

  const translateEvent = (event: string) => {
    let eventType = '';

    switch (event) {
      case 'Deposit':
        eventType = t0('deposit');
        break;
      case 'StreamPaused':
        eventType = t0('pause');
        break;
      case 'StreamResumed':
        eventType = t0('resume');
        break;
      case 'Withdraw':
        eventType = t0('withdraw');
        break;
      case 'StreamCreated':
        eventType = t1('streamCreated');
        break;
      case 'StreamCancelled':
        eventType = t1('streamCancelled');
        break;
      case 'StreamModified':
        eventType = t1('streamModified');
        break;
      case 'PayerWithdraw':
        eventType = t0('withdraw');
        break;
      default:
        eventType = '';
    }

    return eventType;
  };

  return (
    <>
      <button className={classNames('row-action-links', className)} onClick={dialog.toggle}>
        {t0('history')}
      </button>
      <FormDialog dialog={dialog} title={t0('streamHistory')} className="v-min h-min dark:text-white">
        <section className="text-lp-gray-6">
          <StreamedYTD data={data} shouldRun={dialog.open} />
          <table className=" w-full border-separate" style={{ borderSpacing: '0 2px' }}>
            <thead>
              <tr>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-lp-gray-4 dark:text-white">
                  {t0('eventType')}
                </th>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-lp-gray-4 dark:text-white">
                  {t0('timestamp')}
                </th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((p) => (
                <tr className="border-stone-700" key={p.txHash + p.eventType}>
                  <td className="whitespace-nowrap rounded-l border border-r-0 px-4 py-[6px] text-left text-sm dark:text-white">
                    {translateEvent(p.eventType)}
                  </td>
                  <td className="whitespace-nowrap border border-r-0 px-4 py-[6px] text-left text-sm dark:text-white">
                    {intl.formatDateTime(new Date(Number(p.createdTimestamp) * 1e3), { hour12: false })}
                  </td>
                  <td className="whitespace-nowrap rounded-r border px-4 py-[6px] text-center text-sm dark:text-white">
                    <a
                      href={
                        id === 82 || id === 1088 ? `${chainExplorer}tx/${p.txHash}` : `${chainExplorer}/tx/${p.txHash}`
                      }
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >
                      {t0('viewOnExplorer', { explorer: explorerName })}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </FormDialog>
    </>
  );
};

const StreamedYTD: React.FC<{ data: IFormattedSalaryStream; shouldRun: boolean }> = ({ data, shouldRun }) => {
  const [ytdAmount, setYtdAmount] = React.useState<string | null>(null);
  const intl = useIntl();
  const setYTD = React.useCallback(() => {
    //console.log('this is caleld');
    const curYear = new Date().getFullYear();
    if (data === undefined) {
      setYtdAmount(null);
    } else {
      const year = Number(new Date(`01-01-${curYear}`)) / 1e3;
      const start = Number(data.createdTimestamp);
      if (year > start) {
        const totalAmount =
          (((Date.now() - year) / 1000) * Number(data.amountPerSec) - Number(data.pausedAmount)) / 1e20;
        setYtdAmount(intl.formatNumber(totalAmount, { maximumFractionDigits: 5, minimumFractionDigits: 5 }));
      } else {
        const totalAmount =
          (((Date.now() - Number(data.createdTimestamp) * 1000) / 1000) * Number(data.amountPerSec) -
            Number(data.pausedAmount)) /
          1e20;
        setYtdAmount(intl.formatNumber(totalAmount, { maximumFractionDigits: 5, minimumFractionDigits: 5 }));
      }
    }
  }, [data, intl]);

  React.useEffect(() => {
    let id: ReturnType<typeof setInterval> | undefined = undefined;
    if (shouldRun) id = setInterval(setYTD, 1);
    else clearInterval(id);
    return () => clearInterval(id);
  }, [setYTD, shouldRun]);

  return (
    <span className="font-exo text-sm slashed-zero tabular-nums dark:text-white">{`Streamed YTD: ${ytdAmount} ${data.tokenSymbol}`}</span>
  );
};
