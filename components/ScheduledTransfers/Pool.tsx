import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import Tooltip from 'components/Tooltip';
import { networkDetails } from 'lib/networkDetails';
import type { IScheduledTransferPool } from 'queries/useGetScheduledTransfers';
import { useCreateScheduledTransferPayment } from 'queries/useSchedulePayment';
import { useNetwork } from 'wagmi';
import { formatMaxPrice } from './utils';
import BigNumber from 'bignumber.js';
import { ScheduledTransferPayment } from './Payment';

interface IFormElements {
  toAddress: {
    value: string;
  };
  usdAmount: {
    value: string;
  };
  paymentStartAt: {
    value: string;
    valueAsNumber: number;
  };
  paymentEndAt: {
    value: string;
    valueAsNumber: number;
  };
  frequency: {
    value: string;
  };
}

export function ScheduledTransferPool({ pool }: { pool: IScheduledTransferPool }) {
  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  const txHash = React.useRef('');

  const txDialogState = useDialogState();

  const newPaymentDialog = useDialogState();

  const { mutateAsync } = useCreateScheduledTransferPayment({ poolAddress: pool.poolContract });

  const createScheduledPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IFormElements;
    const toAddress = form.toAddress?.value;
    const usdAmount = form.usdAmount?.value;
    const paymentStartAt = form.paymentStartAt?.valueAsNumber;
    const paymentEndAt = form.paymentEndAt?.valueAsNumber;
    const frequency = form.frequency?.value;

    mutateAsync(
      {
        toAddress,
        usdAmount: new BigNumber(usdAmount).times(1e8).toFixed(0),
        paymentStartAt: paymentStartAt && paymentStartAt / 1000,
        paymentEndAt: paymentEndAt && paymentEndAt / 1000,
        frequency: Number(frequency) * 24 * 3600,
      },
      {
        onSuccess: (data) => {
          form.reset();
          newPaymentDialog.toggle();
          txHash.current = data.hash;
          txDialogState.toggle();
        },
      }
    );
  };

  const offset = new Date().getTimezoneOffset();
  const minDate = new Date(new Date().getTime() - offset * 60 * 1000).toISOString().split('T')[0];

  return (
    <>
      <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)] [&:not(:first-of-type)]:mt-4">
        <table className="border-collapse text-lp-gray-4 dark:text-white">
          <tbody>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                Pool
              </th>
              <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {explorerUrl ? (
                  <a href={`${explorerUrl}/address/${pool.poolContract}`} target="_blank" rel="noopener noreferrer">
                    {pool.poolContract}
                  </a>
                ) : (
                  pool.poolContract
                )}
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                Token
              </th>
              <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {explorerUrl ? (
                  <a href={`${explorerUrl}/address/${pool.token.address}`} target="_blank" rel="noopener noreferrer">
                    {`${pool.token.name || pool.token.address}`}
                  </a>
                ) : (
                  <>{`${pool.token.name || pool.token.address}`}</>
                )}
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                Oracle
              </th>
              <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {explorerUrl ? (
                  <a href={`${explorerUrl}/address/${pool.oracle}`} target="_blank" rel="noopener noreferrer">
                    {pool.oracle}
                  </a>
                ) : (
                  <>{pool.oracle}</>
                )}
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                <Tooltip content="Max USD price for the token that the oracle will be allowed to report">
                  Max Price
                </Tooltip>
              </th>
              <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                {pool.maxPrice
                  ? `$${formatMaxPrice(pool.maxPrice, pool.token.decimals || 18).toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}`
                  : ''}
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                Payments
              </th>
              <td className="overflow-x-auto border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                <ScheduledTransferPayment payments={pool.payments} newPaymentDialog={newPaymentDialog} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <FormDialog dialog={newPaymentDialog} title={'Schedule Payment'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={createScheduledPayment}>
            <InputText name="toAddress" label="To" placeholder="0x..." isRequired />

            <InputAmount name="usdAmount" label="Amount (USD)" placeholder="1000" isRequired />

            <label>
              <span className="input-label">Start</span>
              <input type="date" name="paymentStartAt" min={minDate} className="input-field" required />
            </label>

            <label>
              <span className="input-label">End</span>
              <input type="date" name="paymentEndAt" min={minDate} className="input-field" required />
            </label>

            <InputText name="frequency" label="Frequency (Days)" placeholder="1" isRequired />

            <SubmitButton className="mt-5">Create</SubmitButton>
          </form>
        </span>
      </FormDialog>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </>
  );
}
