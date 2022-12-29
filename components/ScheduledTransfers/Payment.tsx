import { PlusIcon } from '@heroicons/react/solid';
import { DisclosureState } from 'ariakit';
import { networkDetails } from 'lib/networkDetails';
import { IScheduledTransferPayment } from 'queries/useGetScheduledTransfers';
import { formatAddress } from 'utils/address';
import { useNetwork } from 'wagmi';
import { formatFrequency } from './utils';

export function ScheduledTransferPayment({
  payments,
  newPaymentDialog,
  isIncoming,
}: {
  payments: Array<IScheduledTransferPayment>;
  newPaymentDialog?: DisclosureState;
  isIncoming?: boolean;
}) {
  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  return (
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
        </tr>
      </thead>
      <tbody className="border border-llama-teal-2 dark:border-lp-gray-7">
        {payments.map((payment) => (
          <tr key={payment.id}>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {explorerUrl ? (
                <a
                  href={`${explorerUrl}/address/${isIncoming ? payment.pool.owner : payment.payee}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(isIncoming ? payment.pool.owner : payment.payee)}
                </a>
              ) : (
                <>{formatAddress(isIncoming ? payment.pool.owner : payment.payee)}</>
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
              {payment.redirects}
            </td>
            <td className="table-description border border-solid border-llama-teal-2 text-center text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
              {formatFrequency(payment.frequency)}
            </td>
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
  );
}
