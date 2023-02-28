import { useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import type { ISubberRefundable } from '~/queries/useGetSubscriptions';
import * as React from 'react';
import { formatFrequency } from '../ScheduledTransfers/utils';
import { useLocale } from '~/hooks';
import { toast } from 'react-hot-toast';
import { TransactionDialog } from '../Dialog';
import { DisclosureState, useDialogState } from 'ariakit';
import { useQueryClient } from '@tanstack/react-query';
import { refundableSubscriptionABI } from '~/lib/abis/refundableSubscription';
import { BeatLoader } from '../BeatLoader';

export function RefundableSubberTable({ data }: { data: Array<ISubberRefundable> }) {
  const txDialogState = useDialogState();
  const txHash = React.useRef('');

  return (
    <div className="flex flex-col gap-4">
      {data.map((contract) => (
        <Contract
          key={'non-refundable-subs' + contract.id}
          data={contract}
          txDialogState={txDialogState}
          txHash={txHash}
        />
      ))}

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </div>
  );
}

const Contract = ({
  data,
  txDialogState,
  txHash,
}: {
  data: ISubberRefundable;
  txDialogState: DisclosureState;
  txHash: React.MutableRefObject<string>;
}) => {
  const { chain } = useNetwork();

  const explorerUrl = chain ? networkDetails[chain.id]?.blockExplorerURL : null;

  const { locale } = useLocale();

  const [isConfirming, setIsConfirming] = React.useState(false);

  const { config } = usePrepareContractWrite({
    address: data.refundableContract.address as `0x${string}`,
    abi: refundableSubscriptionABI,
    chainId: chain?.id,
    functionName: 'unsubscribe',
    args: [data.tier.tierId],
  });

  console.log(data.refundableContract.address, data.tier.tierId);

  const { isLoading, writeAsync } = useContractWrite(config);

  const queryClient = useQueryClient();

  const unsubscribe = () => {
    if (writeAsync) {
      writeAsync()
        .then((data) => {
          txHash.current = data.hash;

          txDialogState.setOpen(true);

          setIsConfirming(true);

          const toastId = toast.loading('Confirming Transaction');

          data.wait().then((receipt) => {
            if (toastId) {
              toast.dismiss(toastId);
            }
            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
            queryClient.invalidateQueries();
            setIsConfirming(false);
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
          setIsConfirming(false);
        });
    } else {
      toast.error('Failed to interact with contract');
    }
  };

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
                  href={`${explorerUrl}/address/${data.refundableContract.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {data.refundableContract.address}
                </a>
              ) : (
                data.refundableContract.address
              )}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Tier Id
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {data.tier.tierId}
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
                href={`${explorerUrl}/address/${data.refundableContract.owner.address}`}
              >
                {data.refundableContract.owner.address}
              </a>
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Period Duration
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(data.refundableContract.periodDuation)}
            </td>
          </tr>

          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Cost per period
            </th>
            <td className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              <span>
                {(+data.tier.costPerPeriod / 10 ** data.tier.token.decimals).toLocaleString(locale, {
                  maximumFractionDigits: 4,
                  minimumFractionDigits: 4,
                })}
              </span>{' '}
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/address/${data.tier.token.address}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="underline"
                >
                  {data.tier.token.symbol}
                </a>
              ) : (
                <span>{data.tier.token.symbol}</span>
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

          <tr>
            <td
              className="table-description border border-solid border-llama-teal-2 text-center font-normal text-lp-gray-4 dark:border-lp-gray-7 dark:text-white"
              colSpan={2}
              onClick={() => unsubscribe()}
            >
              <button
                className="min-w-[10rem] rounded-lg border border-red-500 py-2 px-4 disabled:cursor-not-allowed"
                disabled={isConfirming || isLoading}
              >
                {isLoading || isConfirming ? <BeatLoader className="!h-5" /> : 'Unsubscribe'}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
