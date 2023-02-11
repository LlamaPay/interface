import { DisclosureState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { UserHistoryFragment } from '~/services/generated/graphql';
import { useChainExplorer } from '~/hooks';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { secondsByDuration } from '~/utils/constants';
import { formatAmountInTable } from '~/utils/amount';
import { useIntl, useTranslations } from 'next-intl';

interface MoreInfoProps {
  data: UserHistoryFragment;
  dialog: DisclosureState;
}

function amountStreamed(createdTime: string, streamCreatedTime: string | undefined, amtPerSec: number) {
  const result = ((Number(createdTime) - Number(streamCreatedTime)) * amtPerSec) / 1e20;
  return result.toFixed(5);
}

export const MoreInfo = ({ data, dialog }: MoreInfoProps) => {
  const { url: chainExplorer, name: explorerName, id } = useChainExplorer();

  const txLink = id === 82 || id === 1088 ? `${chainExplorer}tx/${data.txHash}` : `${chainExplorer}/tx/${data.txHash}`;

  const intl = useIntl();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');

  return (
    <>
      <FormDialog dialog={dialog} title={t0('moreInfo')} className="h-min">
        <span className="space-y-4 text-lp-gray-4">
          <section>
            <h1 className="font-medium text-lp-gray-6 dark:text-white">{t0('token')}</h1>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex space-x-1">
                <p className="dark:text-white">{data.stream?.token.name}</p>
                <p className="dark:text-white">({data.stream?.token.symbol})</p>
              </div>
            </div>
          </section>

          {data.eventType === 'StreamModified' && (
            <section>
              <h1 className="font-medium text-lp-gray-6 dark:text-white">{t0('oldStream')}</h1>
              <div className="my-1 rounded border p-2 dark:border-stone-700">
                <div className="flex space-x-1">
                  <p className="dark:text-white">{t0('payer')}:</p>
                  <p className="truncate dark:text-white">{data.oldStream?.payer.id}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="dark:text-white">{t0('payee')}:</p>
                  <p className="truncate dark:text-white">{data.oldStream?.payee.id}</p>
                </div>
                <div className="flex space-x-1">
                  <p className="dark:text-white">{t0('amount')}:</p>
                  <p className="dark:text-white">
                    {!Number.isNaN(data.oldStream?.amountPerSec) &&
                      `${formatAmountInTable(
                        Number(data.oldStream?.amountPerSec) / 1e20,
                        secondsByDuration['month'],
                        intl
                      )} ${data.oldStream?.token?.symbol ?? ''}`}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <p className="dark:text-white">{t1('totalStreamed')}:</p>
                  <p className="dark:text-white">
                    {amountStreamed(
                      data.createdTimestamp,
                      data.oldStream?.createdTimestamp,
                      data.oldStream?.amountPerSec
                    )}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section>
            <h1 className="font-medium text-lp-gray-6 dark:text-white">
              {data.eventType === 'StreamModified' ? t0('newStream') : t0('stream')}
            </h1>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex space-x-1">
                <p className="dark:text-white">{t0('payer')}:</p>
                <p className="truncate dark:text-white">{data.stream?.payer.id}</p>
              </div>

              <div className="flex space-x-1">
                <p className="dark:text-white">{t0('payee')}:</p>
                <p className="truncate dark:text-white">{data.stream?.payee.id}</p>
              </div>

              <div className="flex space-x-1">
                <p className="dark:text-white">{t0('amount')}:</p>

                <p className="dark:text-white">
                  {!Number.isNaN(data.stream?.amountPerSec) &&
                    `${formatAmountInTable(
                      Number(data.stream?.amountPerSec) / 1e20,
                      secondsByDuration['month'],
                      intl
                    )} ${data.stream?.token.symbol}`}
                </p>
              </div>

              {data.eventType === 'StreamCancelled' && (
                <div className="flex space-x-1">
                  <p className="dark:text-white">{t1('totalStreamed')}:</p>
                  <p className="dark:text-white">
                    {amountStreamed(data.createdTimestamp, data.stream?.createdTimestamp, data.stream?.amountPerSec)}
                  </p>
                </div>
              )}
            </div>
          </section>

          <section>
            <h1 className="font-medium text-lp-gray-6 dark:text-white">{t0('eventTimestamp')}</h1>
            <p className="dark:text-white">
              {intl.formatDateTime(new Date(Number(data.createdTimestamp) * 1e3), {
                hour12: false,
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </p>
          </section>

          <a
            href={txLink}
            target="_blank"
            rel="noreferrer noopener"
            className="form-submit-button mt-4 flex items-center justify-center gap-2"
          >
            <span>{t0('viewOnExplorer', { explorer: explorerName })}</span>
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </a>
        </span>
      </FormDialog>
    </>
  );
};
