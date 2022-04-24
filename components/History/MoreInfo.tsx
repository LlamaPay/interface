import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { UserHistoryFragment } from 'services/generated/graphql';
import { useChainExplorer, useLocale } from 'hooks';
import { ExternalLinkIcon } from '@heroicons/react/outline';

interface MoreInfoProps {
  data: UserHistoryFragment;
  dialog: DisclosureState;
}

function amountStreamed(createdTime: string, streamCreatedTime: string | undefined, amtPerSec: number) {
  const result = ((Number(createdTime) - Number(streamCreatedTime)) * amtPerSec) / 1e20;
  return result.toFixed(5);
}

export const MoreInfo = ({ data, dialog }: MoreInfoProps) => {
  const { url: chainExplorer, name: explorerName } = useChainExplorer();

  const txLink = `${chainExplorer}/tx/${data.txHash}`;

  const { locale } = useLocale();

  return (
    <>
      <FormDialog dialog={dialog} title="More Info" className="h-min">
        <span className="space-y-4">
          <section>
            <h1>Token:</h1>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex space-x-1">
                <p>{data.stream.token.name}</p>
                <p>({data.stream.token.symbol})</p>
              </div>
            </div>
          </section>
          {data.eventType === 'StreamModified' ? (
            <section>
              <h1>Old Stream</h1>
              <div className="my-1 rounded border p-2 dark:border-stone-700">
                <div className="flex space-x-1">
                  <p>Payer:</p>
                  <p>{data.oldStream?.payer.id}</p>
                </div>
                <div className="flex space-x-1">
                  <p>Payee:</p>
                  <p>{data.oldStream?.payee.id}</p>
                </div>
                <div className="flex space-x-1">
                  <p>Amount Per Sec:</p>
                  <p>{(data.oldStream?.amountPerSec / 1e20).toFixed(5)}</p>
                </div>
                <div className="flex space-x-1">
                  <p>Total Streamed:</p>
                  <p>
                    {amountStreamed(
                      data.createdTimestamp,
                      data.oldStream?.createdTimestamp,
                      data.oldStream?.amountPerSec
                    )}
                  </p>
                </div>
              </div>
            </section>
          ) : (
            ''
          )}
          <section>
            <h1>{data.eventType === 'StreamModified' ? 'New Stream' : 'Stream'}</h1>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex space-x-1">
                <p>Payer:</p>
                <p>{data.stream.payer.id}</p>
              </div>
              <div className="flex space-x-1">
                <p>Payee:</p>
                <p>{data.stream.payee.id}</p>
              </div>
              <div className="flex space-x-1">
                <p>Amount Per Sec:</p>
                <p>{(data.stream.amountPerSec / 1e20).toFixed(5)}</p>
              </div>
              {data.eventType === 'StreamCancelled' ? (
                <div className="flex space-x-1">
                  <p>Total Streamed:</p>
                  <p>
                    {amountStreamed(data.createdTimestamp, data.stream?.createdTimestamp, data.stream?.amountPerSec)}
                  </p>
                </div>
              ) : (
                ''
              )}
            </div>
          </section>
          <section>
            <h1>Event Timestamp</h1>
            <p>
              {new Date(Number(data.createdTimestamp) * 1e3).toLocaleString(locale, {
                hour12: false,
              })}
            </p>
          </section>
          <section className="flex">
            <a
              href={txLink}
              target="_blank"
              rel="noreferrer noopener"
              className="form-submit-button mt-4 flex items-center justify-center gap-2"
            >
              <span>View on {explorerName}</span>
              <ExternalLinkIcon className="h-4 w-4" />
            </a>
          </section>
        </span>
      </FormDialog>
    </>
  );
};
