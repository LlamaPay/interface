import * as React from 'react';
import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import { FormDialog } from 'components/Dialog';
import { useChainExplorer } from 'hooks';
import { useIntl, useTranslations } from 'next-intl';
import { IStream } from 'types';

interface StreamHistoryProps {
  data: IStream;
  className?: string | boolean;
}

export const StreamHistory = ({ data, className }: StreamHistoryProps) => {
  const historicalData = data.historicalEvents;

  const dialog = useDialogState();

  const { url: chainExplorer, name: explorerName } = useChainExplorer();

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
      <FormDialog dialog={dialog} title={t0('streamHistory')} className="v-min h-min">
        <section className="text-[#303030]">
          <table className=" w-full border-separate" style={{ borderSpacing: '0 2px' }}>
            <thead>
              <tr>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-[#3D3D3D]">{t0('eventType')}</th>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-[#3D3D3D]">{t0('timestamp')}</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((p) => (
                <tr className="border-stone-700" key={p.txHash + p.eventType}>
                  <td className="whitespace-nowrap rounded-l border border-r-0 px-4 py-[6px] text-left text-sm">
                    {translateEvent(p.eventType)}
                  </td>
                  <td className="whitespace-nowrap border border-r-0 px-4 py-[6px] text-left text-sm">
                    {intl.formatDateTime(new Date(Number(p.createdTimestamp) * 1e3), { hour12: false })}
                  </td>
                  <td className="whitespace-nowrap rounded-r border px-4 py-[6px] text-center text-sm">
                    <a
                      href={`${chainExplorer}/tx/${p.txHash}`}
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
