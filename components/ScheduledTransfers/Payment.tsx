import * as React from 'react';
import { PlusIcon } from '@heroicons/react/solid';
import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { InputText, SubmitButton } from '~/components/Form';
import { getAddress } from 'ethers/lib/utils';
import { networkDetails } from '~/lib/networkDetails';
import type { IScheduledTransferPayment } from '~/queries/useGetScheduledTransfers';
import { useQueryClient } from 'react-query';
import { BeatLoader } from 'react-spinners';
import { formatAddress } from '~/utils/address';
import { useContractWrite, useNetwork } from 'wagmi';
import { formatFrequency } from './utils';
import toast from 'react-hot-toast';
import { scheduledPaymentsContractABI } from '~/lib/abis/scheduledPaymentsContract';

export function ScheduledTransferPayment({
  payments,
  newPaymentDialog,
  isIncoming,
}: {
  payments: Array<IScheduledTransferPayment>;
  newPaymentDialog?: DisclosureState;
  isIncoming?: boolean;
}) {
  const txHash = React.useRef('');

  const txDialogState = useDialogState();

  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  return (
    <>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              {isIncoming ? 'Payer' : 'Payee'}
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Start
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              End
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Last Paid
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Amount USD
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Redirects
            </th>
            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7">
              Frequency
            </th>

            <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-center text-sm font-normal dark:border-lp-gray-7"></th>
          </tr>
        </thead>

        <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {explorerUrl ? (
                  <a
                    href={`${explorerUrl}/address/${isIncoming ? payment.pool.owner : payment.history[0].to}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {formatAddress(isIncoming ? payment.pool.owner : payment.history[0].to)}
                  </a>
                ) : (
                  <>{formatAddress(isIncoming ? payment.pool.owner : payment.history[0].to)}</>
                )}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {payment.starts
                  ? new Date(Number(payment.starts) * 1000).toLocaleDateString() +
                    ', ' +
                    new Date(Number(payment.starts) * 1000).toLocaleTimeString()
                  : ''}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {payment.ends
                  ? new Date(Number(payment.ends) * 1000).toLocaleDateString() +
                    ', ' +
                    new Date(Number(payment.ends) * 1000).toLocaleTimeString()
                  : ''}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {payment.lastPaid !== payment.starts
                  ? new Date(Number(payment.lastPaid) * 1000).toLocaleDateString() +
                    ', ' +
                    new Date(Number(payment.lastPaid) * 1000).toLocaleTimeString()
                  : ''}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {payment.usdAmount
                  ? '$' +
                    (Number(payment.usdAmount) / 1e8).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })
                  : ''}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {explorerUrl && payment.redirects ? (
                  <a href={`${explorerUrl}/address/${payment.redirects}`} target="_blank" rel="noopener noreferrer">
                    {formatAddress(payment.redirects)}
                  </a>
                ) : (
                  ''
                )}
              </td>
              <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {formatFrequency(payment.frequency)}
              </td>
              {isIncoming ? (
                <Redirects
                  txHash={txHash}
                  txDialogState={txDialogState}
                  streamId={payment.streamId}
                  poolContract={payment.pool.poolContract}
                />
              ) : (
                <CancelTransfer
                  txHash={txHash}
                  txDialogState={txDialogState}
                  streamId={payment.streamId}
                  poolContract={payment.pool.poolContract}
                />
              )}
            </tr>
          ))}

          {newPaymentDialog && (
            <tr>
              <td
                className="table-description border border-solid border-llama-teal-2 py-4 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white"
                colSpan={10}
              >
                <button
                  className="form-submit-button font-normalqq mx-auto flex max-w-fit flex-nowrap items-center gap-1"
                  onClick={newPaymentDialog.toggle}
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>New Payment</span>
                </button>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </>
  );
}

const Redirects = ({
  txHash,
  txDialogState,
  streamId,
  poolContract,
}: {
  txHash: React.MutableRefObject<string>;
  txDialogState: DisclosureState;
  streamId: string;
  poolContract: string;
}) => {
  const redirectDialog = useDialogState();

  const queryClient = useQueryClient();

  const [{ loading: updatingRedirect }, setRedirect] = useContractWrite(
    {
      addressOrName: poolContract,
      contractInterface: scheduledPaymentsContractABI,
    },
    'setRedirect'
  );

  const updateRedirect = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const newRedirects = form.newRedirects?.value;

    setRedirect({ args: [streamId, getAddress(newRedirects)] }).then((res) => {
      if (res.error) {
        redirectDialog.hide();
        toast.error(res.error.message);
      } else {
        const toastid = toast.loading(`Confirming Transaction`);

        redirectDialog.hide();

        txHash.current = res.data.hash;

        txDialogState.toggle();

        res.data?.wait().then((receipt) => {
          toast.dismiss(toastid);

          receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
        });

        queryClient.invalidateQueries();
      }
    });
  };

  return (
    <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
      <button className="primary-button py-1 px-[6px] text-xs font-medium" onClick={redirectDialog.toggle}>
        Redirect
      </button>

      <FormDialog dialog={redirectDialog} title={'Redirects'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={updateRedirect}>
            <InputText name="newRedirects" label="New Redirect Address" placeholder="0x..." isRequired />

            <SubmitButton className="mt-5">
              {updatingRedirect ? <BeatLoader size={6} color="white" /> : 'Update'}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>
    </td>
  );
};

const CancelTransfer = ({
  txHash,
  txDialogState,
  streamId,
  poolContract,
}: {
  txHash: React.MutableRefObject<string>;
  txDialogState: DisclosureState;
  streamId: string;
  poolContract: string;
}) => {
  const queryClient = useQueryClient();

  const [{}, cancelTransfer] = useContractWrite(
    {
      addressOrName: poolContract,
      contractInterface: scheduledPaymentsContractABI,
    },
    'cancelTransfer'
  );

  const cancel = () => {
    cancelTransfer({ args: [streamId] }).then((res) => {
      if (res.error) {
        toast.error(res.error.message);
      } else {
        const toastid = toast.loading(`Confirming Transaction`);

        txHash.current = res.data.hash;

        txDialogState.toggle();

        res.data?.wait().then((receipt) => {
          toast.dismiss(toastid);

          receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
        });

        queryClient.invalidateQueries();
      }
    });
  };

  return (
    <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
      <button className="primary-button py-1 px-[6px] text-xs font-medium" onClick={cancel}>
        Cancel
      </button>
    </td>
  );
};
