import { useDialogState } from 'ariakit';
import classNames from 'classnames';
import { FormDialog } from 'components/Dialog';
import { useChainExplorer, useLocale } from 'hooks';
import React from 'react';
import { IStream } from 'types';

interface StreamHistoryProps {
  data: IStream;
  title: string;
  className?: string | boolean;
}

export const StreamHistory = ({ data, title, className }: StreamHistoryProps) => {
  const historicalData = data.historicalEvents;

  const dialog = useDialogState();

  const { url: chainExplorer, name: explorerName } = useChainExplorer();

  const { locale } = useLocale();

  return (
    <>
      <button className={classNames('row-action-links', className)} onClick={dialog.toggle}>
        History
      </button>
      <FormDialog dialog={dialog} title={title} className="v-min h-min">
        <section className="text-[#303030]">
          <table className=" w-full border-separate" style={{ borderSpacing: 0 }}>
            <thead>
              <tr>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-[#3D3D3D]">Event Type</th>
                <th className="px-4 py-[6px] text-left text-sm font-medium text-[#3D3D3D]">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {historicalData.map((p) => (
                <tr className="border-stone-700" key={p.txHash + p.eventType}>
                  <td className="rounded-l border border-r-0 px-4 py-[6px] text-left text-sm">
                    {p.eventType.replace(/([A-Z])/g, ' $1')}
                  </td>
                  <td className="border border-r-0 px-4 py-[6px] text-left text-sm">
                    {new Date(Number(p.createdTimestamp) * 1e3).toLocaleString(locale, { hour12: false })}
                  </td>
                  <td className="rounded-r border px-4 py-[6px] text-center text-sm">
                    <a
                      href={`${chainExplorer}/tx/${p.txHash}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline"
                    >{`View on ${explorerName}`}</a>
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
