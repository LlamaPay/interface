import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { InputAmount, InputText, SubmitButton } from '~/components/Form';
import Tooltip from '~/components/Tooltip';
import { networkDetails } from '~/lib/networkDetails';
import type { IScheduledTransferPool } from '~/queries/useGetScheduledTransfers';
import { useCreateScheduledTransferPayment } from '~/queries/useSchedulePayment';
import { useContractWrite, useNetwork } from 'wagmi';
import { getFormattedMaxPrice, getMaxPriceInUSD } from './utils';
import BigNumber from 'bignumber.js';
import { ScheduledTransferPayment } from './Payment';
import { scheduledPaymentsContractABI } from '~/lib/abis/scheduledPaymentsContract';
import { getAddress } from 'ethers/lib/utils';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { BeatLoader } from 'react-spinners';

interface INewPaymentFormElements {
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

interface IUpdateOracleFormElements {
  newOracleAddress: {
    value: string;
  };
}

interface IUpdateMaxPriceFormElements {
  newMinPrice: {
    value: string;
  };
}

export function ScheduledTransferPool({ pool }: { pool: IScheduledTransferPool }) {
  const [{ data: networkData }] = useNetwork();

  const explorerUrl = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.blockExplorerURL : null;

  const txHash = React.useRef('');

  const txDialogState = useDialogState();

  const newPaymentDialog = useDialogState();

  const minPriceDialog = useDialogState();

  const oracleDialog = useDialogState();

  const queryClient = useQueryClient();

  const { mutateAsync } = useCreateScheduledTransferPayment({ poolAddress: pool.poolContract });

  const offset = new Date().getTimezoneOffset();
  const minDate = new Date(new Date().getTime() - offset * 60 * 1000).toISOString().split('T')[0];

  const createScheduledPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & INewPaymentFormElements;
    const toAddress = form.toAddress?.value;
    const usdAmount = form.usdAmount?.value;
    const paymentStartAt = form.paymentStartAt?.valueAsNumber;
    const paymentEndAt = form.paymentEndAt?.valueAsNumber;
    const frequency = form.frequency?.value;

    const startData =
      (new Date(minDate).getTime() === paymentStartAt ? new Date().getTime() + 10 * 60 * 1000 : paymentStartAt) / 1000;
    const endDate =
      (new Date(minDate).getTime() === paymentEndAt ? new Date().getTime() + 10 * 60 * 1000 : paymentEndAt) / 1000;

    mutateAsync(
      {
        toAddress,
        usdAmount: new BigNumber(usdAmount).times(1e8).toFixed(0),
        paymentStartAt: paymentStartAt && startData.toFixed(0),
        paymentEndAt: paymentEndAt && endDate.toFixed(0),
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

  const [{ loading: updatingMinPrice }, setMinPrice] = useContractWrite(
    {
      addressOrName: pool.poolContract,
      contractInterface: scheduledPaymentsContractABI,
    },
    'setMaxPrice'
  );

  const [{ loading: updatingOracle }, changeOracle] = useContractWrite(
    {
      addressOrName: pool.poolContract,
      contractInterface: scheduledPaymentsContractABI,
    },
    'changeOracle'
  );

  const updateMinPrice = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IUpdateMaxPriceFormElements;

    const newMinPrice = form.newMinPrice?.value;

    if (pool.token.decimals && newMinPrice) {
      const formattedPrice = getFormattedMaxPrice(Number(newMinPrice), pool.token.decimals || 18);

      setMinPrice({ args: [formattedPrice] }).then((res) => {
        if (res.error) {
          minPriceDialog.hide();
          toast.error(res.error.message);
        } else {
          const toastid = toast.loading(`Confirming Transaction`);

          minPriceDialog.hide();

          txHash.current = res.data.hash;

          txDialogState.toggle();

          res.data?.wait().then((receipt) => {
            toast.dismiss(toastid);

            receipt.status === 1 ? toast.success('Transaction Success') : toast.error('Transaction Failed');
          });

          queryClient.invalidateQueries();
        }
      });
    }
  };

  const updateOracle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IUpdateOracleFormElements;

    const newOracleAddress = form.newOracleAddress?.value;

    changeOracle({ args: [getAddress(newOracleAddress)] }).then((res) => {
      if (res.error) {
        oracleDialog.hide();
        toast.error(res.error.message);
      } else {
        const toastid = toast.loading(`Confirming Transaction`);

        oracleDialog.hide();

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
                <span className="flex flex-wrap items-center justify-between gap-4">
                  <span>
                    {explorerUrl ? (
                      <a href={`${explorerUrl}/address/${pool.oracle}`} target="_blank" rel="noopener noreferrer">
                        {pool.oracle}
                      </a>
                    ) : (
                      <>{pool.oracle}</>
                    )}
                  </span>
                  <button className="primary-button py-1 px-[6px] text-xs font-medium" onClick={oracleDialog.toggle}>
                    Change
                  </button>
                </span>
              </td>
            </tr>
            <tr>
              <th className="whitespace-nowrap border border-llama-teal-2 py-[6px] px-4 text-left text-sm font-semibold dark:border-lp-gray-7">
                <Tooltip content="Min USD price for the token that the oracle will be allowed to report">
                  Min Price
                </Tooltip>
              </th>
              <td className="table-description border border-solid border-llama-teal-2 text-lp-gray-4 dark:border-lp-gray-7 dark:text-white">
                <span className="flex flex-wrap items-center justify-between gap-4">
                  <span>
                    {pool.maxPrice
                      ? `$${getMaxPriceInUSD(pool.maxPrice, pool.token.decimals || 18).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}`
                      : ''}
                  </span>

                  <button className="primary-button py-1 px-[6px] text-xs font-medium" onClick={minPriceDialog.toggle}>
                    Change
                  </button>
                </span>
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
              <input type="date" name="paymentStartAt" className="input-field" required />
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

      <FormDialog dialog={minPriceDialog} title={'Min Price'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={updateMinPrice}>
            <InputAmount name="newMinPrice" label="New Minimum Price (USD)" placeholder="1000" isRequired />

            <SubmitButton className="mt-5">
              {updatingMinPrice ? <BeatLoader size={6} color="white" /> : 'Update'}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>

      <FormDialog dialog={oracleDialog} title={'Oracle'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={updateOracle}>
            <InputText name="newOracleAddress" label="New Address" placeholder="0x..." isRequired />

            <SubmitButton className="mt-5">
              {updatingOracle ? <BeatLoader size={6} color="white" /> : 'Update'}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </>
  );
}
