import { useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import type { ISubberNonRefundable } from '~/queries/useGetSubscriptions';
import * as React from 'react';
import { formatFrequency } from '../ScheduledTransfers/utils';
import { useLocale } from '~/hooks';

export function NonRefundableSubberTable({ data }: { data: Array<ISubberNonRefundable> }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((contract) => (
        <Contract key={'non-refundable-subs' + contract.id} data={contract} />
      ))}
    </div>
  );
}

const Contract = ({ data }: { data: ISubberNonRefundable }) => {
  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;

  const { locale } = useLocale();

  return (
    <div className="max-w-[calc(100vw-16px)] overflow-x-auto border border-dashed border-llama-teal-2 p-1 dark:border-lp-gray-7 md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)]">
      <table className="w-full border-collapse">
        <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Contract
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/address/${data.sub.nonRefundableContract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {data.sub.nonRefundableContract.address}
                </a>
              ) : (
                data.sub.nonRefundableContract.address
              )}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Sub Id
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {data.sub.subId}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Owner
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <a
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
                href={`${explorerUrl}/address/${data.sub.nonRefundableContract.owner.address}`}
              >
                {data.sub.nonRefundableContract.owner.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Period Duration
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(data.sub.duration)}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Cost of Subscription
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <span>
                {(+data.sub.costOfSub / 10 ** data.sub.token.decimals).toLocaleString(locale, {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 4,
                })}
              </span>{' '}
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/address/${data.sub.token.address}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline"
                >
                  {data.sub.token.symbol}
                </a>
              ) : (
                <span>{data.sub.token.symbol}</span>
              )}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Expires In
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {Number(data.expires) < Date.now() / 1000
                ? 'Expired'
                : formatFrequency((Number(data.expires) - Date.now() / 1000).toString())}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
