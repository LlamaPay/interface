import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { InputAmount, InputText, SubmitButton } from '~/components/Form';
import Tooltip from '~/components/Tooltip';
import { networkDetails } from '~/lib/networkDetails';
import type { IScheduledTransferPool } from '~/queries/useGetScheduledTransfers';
import { useCreateScheduledTransferPayment } from '~/queries/useSchedulePayment';
import { erc20ABI, useContractRead, useContractWrite, useNetwork } from 'wagmi';
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

interface IDepositFormElements {
  toDeposit: {
    value: string;
  };
}

interface IWithdrawFormElements {
  toWithdraw: {
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

  const depositDialog = useDialogState();

  const withdrawDialog = useDialogState();

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

    mutateAsync(
      {
        toAddress,
        usdAmount: new BigNumber(usdAmount).times(1e8).toFixed(0),
        paymentStartAt: paymentStartAt / 1000,
        paymentEndAt: paymentEndAt / 1000,
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

  const [{ loading: depositing }, deposit] = useContractWrite(
    {
      addressOrName: pool.token.address,
      contractInterface: erc20ABI,
    },
    'transfer'
  );

  const [{ loading: withdrawing }, withdraw] = useContractWrite(
    {
      addressOrName: pool.poolContract,
      contractInterface: scheduledPaymentsContractABI,
    },
    'withdrawPayer'
  );

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: pool.token.address,
      contractInterface: erc20ABI,
    },
    'balanceOf',
    {
      args: [pool.poolContract],
    }
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

  const onDeposit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IDepositFormElements;
    const toDeposit = form.toDeposit?.value;
    if (!pool.poolContract || !pool.token.decimals || !toDeposit || !pool.token.address) return;
    const formatted = new BigNumber(toDeposit).times(10 ** pool.token.decimals).toFixed(0);
    deposit({ args: [pool.poolContract, formatted] }).then((res) => {
      if (res.error) {
        depositDialog.hide();
        toast.error(res.error.message);
      } else {
        const toastid = toast.loading(`Depositing`);

        depositDialog.hide();

        txHash.current = res.data.hash;

        txDialogState.toggle();

        res.data?.wait().then((receipt) => {
          toast.dismiss(toastid);

          receipt.status === 1 ? toast.success('Deposit Success') : toast.error('Deposit Failed');
        });

        queryClient.invalidateQueries();
      }
    });
  };

  const onWithdraw = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IWithdrawFormElements;
    const toWithdraw = form.toWithdraw?.value;
    if (!pool.poolContract || !pool.token.decimals || !toWithdraw || !pool.token.address) return;
    const formatted = new BigNumber(toWithdraw).times(10 ** pool.token.decimals).toFixed(0);
    withdraw({ args: [pool.token.address, formatted] }).then((res) => {
      if (res.error) {
        depositDialog.hide();
        toast.error(res.error.message);
      } else {
        const toastid = toast.loading(`Withdrawing`);

        depositDialog.hide();

        txHash.current = res.data.hash;

        txDialogState.toggle();

        res.data?.wait().then((receipt) => {
          toast.dismiss(toastid);

          receipt.status === 1 ? toast.success('Withdraw Success') : toast.error('Withdraw Failed');
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
                <span className="flex flex-wrap items-center justify-between gap-4">
                  <span className="flex space-x-1">
                    {explorerUrl ? (
                      <a
                        href={`${explorerUrl}/address/${pool.token.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {`${pool.token.name || pool.token.address}`}
                      </a>
                    ) : (
                      <>{`${pool.token.name || pool.token.address}`}</>
                    )}
                    <a>{`(Balance: ${
                      pool.token.decimals && pool.token.symbol
                        ? `${Number(balance) / 10 ** pool.token.decimals} ${pool.token.symbol}`
                        : balance
                    })`}</a>
                  </span>
                  <span className="flex space-x-2">
                    <button className="primary-button py-1 px-[6px] text-xs font-medium" onClick={depositDialog.toggle}>
                      Deposit
                    </button>
                    <button
                      className="primary-button py-1 px-[6px] text-xs font-medium"
                      onClick={withdrawDialog.toggle}
                    >
                      Withdraw
                    </button>
                  </span>
                </span>
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

      <FormDialog dialog={depositDialog} title={'Deposit'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={onDeposit}>
            <InputAmount name="toDeposit" label="To Deposit" placeholder="0" isRequired />

            <SubmitButton className="mt-5">
              {depositing ? <BeatLoader size={6} color="white" /> : 'Deposit'}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>

      <FormDialog dialog={withdrawDialog} title={'Withdraw'}>
        <span className="space-y-4 text-lp-gray-6 dark:text-white">
          <form className="mx-auto flex flex-col gap-4" onSubmit={onWithdraw}>
            <InputAmount name="toWithdraw" label="To Withdraw" placeholder="0" isRequired />

            <SubmitButton className="mt-5">
              {withdrawing ? <BeatLoader size={6} color="white" /> : 'Withdraw'}
            </SubmitButton>
          </form>
        </span>
      </FormDialog>

      <TransactionDialog dialog={txDialogState} transactionHash={txHash.current || ''} />
    </>
  );
}
