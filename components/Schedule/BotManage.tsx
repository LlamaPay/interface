import * as React from 'react';
import { DisclosureState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { networkDetails } from '~/lib/networkDetails';
import { secondsByDuration } from '~/utils/constants';
import { useContractRead, useContractWrite } from 'wagmi';
import { botContractABI } from '~/lib/abis/botContract';
import { InputAmount, InputText, SubmitButton } from '~/components/Form';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import useGetBotInfo from '~/queries/useGetBotInfo';
import { formatAddress } from '~/utils/address';
import { zeroAdd } from '~/utils/constants';
import { useApproveTokenForMaxAmt } from '~/queries/useTokenApproval';
import { ethers } from 'ethers';

export default function BotFunds({
  dialog,
  chainId,
  accountAddress,
  nativeCurrency,
}: {
  dialog: DisclosureState;
  chainId: number;
  accountAddress: string;
  nativeCurrency: string | undefined;
}) {
  const botAddress = networkDetails[chainId].botAddress;
  const queryClient = useQueryClient();
  const [formData, setFormData] = React.useState({
    startDate: new Date(Date.now()).toISOString().slice(0, 10),
    frequency: 'daily',
  });
  const [redirectAddress, setRedirectAddress] = React.useState<string | null>(null);
  const [selectedToken, setSelectedToken] = React.useState<string>('');

  const { data: botInfo, isLoading } = useGetBotInfo();

  const { mutate: approveMax } = useApproveTokenForMaxAmt();

  const { data: balance } = useContractRead({
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'balances',
    args: [accountAddress],
  });

  const { writeAsync: refund } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'refund',
  });

  const { writeAsync: deposit } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'deposit',
  });
  const { writeAsync: cancelWithdraw } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'cancelWithdraw',
  });

  const { writeAsync: scheduleWithdraw } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'scheduleWithdraw',
  });

  const { writeAsync: setRedirect } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'setRedirect',
  });

  const { writeAsync: cancelRedirect } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: botAddress as `0x${string}`,
    abi: botContractABI,
    functionName: 'cancelRedirect',
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;

    deposit({
      recklesslySetUnpreparedOverrides: {
        value: ethers.utils.parseEther(form.amount.value),
      },
    })
      .then((data) => {
        const toastid = toast.loading(`Sending ${form.amount.value} ${nativeCurrency} to Bot`);
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Sent to Bot') : toast.error('Failed to Send to Bot');
        });
        queryClient.invalidateQueries();
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function handleRefund() {
    refund()
      .then((data) => {
        const toastid = toast.loading(`Refunding ${Number(balance) / 1e18} ${nativeCurrency}`);
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Refunded') : toast.error('Failed to Refund');
        });
        queryClient.invalidateQueries();
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function handleCancel(p: string) {
    if (!botInfo?.toInclude) return;
    const ele = botInfo.toInclude[p];
    cancelWithdraw({
      recklesslySetUnpreparedArgs: [ele.token, ele.from, ele.to, ele.amountPerSec, ele.starts, ele.frequency],
    })
      .then((data) => {
        const toastid = toast.loading(`Cancelling Withdrawal`);
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Cancelled') : toast.error('Failed to Cancel');
        });
        queryClient.invalidateQueries();
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }

  function handleSchedule(e: 'incoming' | 'outgoing') {
    const freq = formData.frequency;
    const start = new Date(formData.startDate).getTime() / 1e3;

    scheduleWithdraw({
      recklesslySetUnpreparedArgs: [
        zeroAdd,
        e === 'incoming' ? zeroAdd : accountAddress,
        e === 'outgoing' ? zeroAdd : accountAddress,
        0,
        start,
        freq === 'daily'
          ? secondsByDuration['day']
          : freq === 'weekly'
          ? secondsByDuration['week']
          : freq === 'biweekly'
          ? secondsByDuration['biweek']
          : freq === 'monthly'
          ? secondsByDuration['month']
          : null,
      ],
    })
      .then((data) => {
        const toastId = toast.loading('Scheduling Events');
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastId);
          receipt.status === 1
            ? toast.success('Successfully Scheduled Events')
            : toast.error('Failed to Schedule Events');
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function onRedirect() {
    approveMax({ tokenAddress: selectedToken, spenderAddress: botAddress });
    setRedirect({ recklesslySetUnpreparedArgs: [redirectAddress] })
      .then((data) => {
        const toastid = toast.loading(`Setting Redirect to ${formatAddress(redirectAddress ?? '')}`);
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Set Redirect') : toast.error('Failed to Set Redirect');
        });
        queryClient.invalidateQueries();
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function onCancelRedirect() {
    cancelRedirect()
      .then((data) => {
        const toastid = toast.loading(`Cancelling Redirect`);
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1
            ? toast.success('Successfully Cancelled Redirect')
            : toast.error('Failed to Cancel Redirect');
        });
        queryClient.invalidateQueries();
      })
      .catch((err) => {
        dialog.hide();
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  function onCurrentDate() {
    setFormData((prev) => ({ ...prev, ['startDate']: new Date(Date.now()).toISOString().slice(0, 10) }));
  }

  return (
    <>
      <FormDialog dialog={dialog} title="Manage Bot" className="h-min	min-w-fit text-lp-gray-6 dark:text-white">
        <section className="mb-4 flex flex-col gap-1">
          <div className="flex gap-2">
            <span>{`Balance: ${(Number(balance) / 1e18).toFixed(5)} ${nativeCurrency}`}</span>
            <button className="row-action-links" onClick={handleRefund}>
              Refund
            </button>
          </div>
          <div className="border px-2 py-2">
            <form onSubmit={onSubmit}>
              <div className="flex space-x-2">
                <div className="w-full">
                  <InputAmount name="amount" isRequired label="Amount to Deposit" />
                </div>
                <SubmitButton className="bottom-0 h-min w-2/5 place-self-end">Deposit</SubmitButton>
              </div>
            </form>
          </div>
        </section>

        <section className="my-4 flex flex-col gap-1">
          <h1>Schedule for All Streams:</h1>
          <div className="flex flex-col gap-4 border p-2">
            <label>
              <span className="input-label">Start Date</span>

              <div className="relative flex">
                <input
                  className="input-field pr-20"
                  onChange={(e) => handleChange(e.target.value, 'startDate')}
                  required
                  type="date"
                  value={formData.startDate}
                />
                <button
                  type="button"
                  className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-[#4E575F] px-2 text-xs font-bold text-[#4E575F] disabled:cursor-not-allowed"
                  onClick={onCurrentDate}
                >
                  {'Today'}
                </button>
              </div>
            </label>

            <label className="flex flex-col">
              <span className="input-label">Frequency</span>
              <select onChange={(e) => handleChange(e.target.value, 'frequency')} className="input-field">
                <option value="daily">Every Day</option>
                <option value="weekly">Every 7 Days</option>
                <option value="biweekly">Every 14 Days</option>
                <option value="monthly">Every 30 Days</option>
              </select>
            </label>

            <div className="flex flex-col items-center justify-between gap-1 md:flex-row">
              <button
                onClick={() => handleSchedule('incoming')}
                className="rounded-lg border bg-white p-3 text-sm hover:bg-lp-primary dark:border-[#252525] dark:bg-[#252525]"
              >
                Schedule Incoming Streams
              </button>
              <small>or</small>
              <button
                onClick={() => handleSchedule('outgoing')}
                className="rounded-lg border bg-white p-3 text-sm hover:bg-lp-primary dark:border-[#252525] dark:bg-[#252525]"
              >
                Schedule Outgoing Streams
              </button>
            </div>
          </div>
        </section>

        {isLoading && (
          <div className="pt-1">
            <span>Loading Redirect and Schedule Info...</span>
          </div>
        )}

        {!isLoading && (
          <>
            <section className="my-4 flex flex-col gap-1">
              <div className="flex space-x-2">
                <span className="text-md font-evo">
                  {botInfo?.redirect === zeroAdd || !botInfo?.redirect
                    ? 'Redirect not Set'
                    : `Redirecting Withdrawals to ${formatAddress(botInfo?.redirect)}`}
                </span>
                {botInfo?.redirect !== zeroAdd && botInfo?.redirect && (
                  <button className="row-action-links" onClick={onCancelRedirect}>
                    Remove
                  </button>
                )}
              </div>

              <div className="border px-2 py-2">
                <div className="flex space-x-2">
                  <div className="w-full">
                    <InputText
                      name="redirectTo"
                      isRequired
                      label="Redirect Withdrawals To"
                      placeholder="0x..."
                      handleChange={(e) => setRedirectAddress(e.target.value)}
                    />
                  </div>
                  <div className="w-1/4">
                    <label className="input-label">Token</label>
                    <select onChange={(e) => setSelectedToken(e.target.value)} name="token" className="input-field">
                      <option value={''}></option>
                      {botInfo?.tokenSymbols &&
                        Object.keys(botInfo?.tokenSymbols).map((p) => (
                          <option key={p} value={p}>
                            {botInfo?.tokenSymbols[p]}
                          </option>
                        ))}
                    </select>
                  </div>
                  <SubmitButton onClick={onRedirect} className="bottom-0 h-min w-2/5 place-self-end">
                    Redirect
                  </SubmitButton>
                </div>
              </div>
            </section>

            <section className="my-4 flex flex-col gap-1">
              <h1>Scheduled Streams:</h1>

              <div className="overflow-x-auto">
                <table className="border">
                  <thead>
                    <tr>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">Type</th>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">
                        Address Related
                      </th>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">
                        Token
                      </th>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">
                        Amount/Month
                      </th>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white">
                        Frequency
                      </th>
                      <th className="table-description text-sm font-semibold !text-lp-gray-4 dark:!text-white"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {botInfo?.toInclude &&
                      Object.keys(botInfo.toInclude).map((p) => (
                        <tr key={p} className="table-row">
                          <td className="table-description text-center dark:text-white">
                            <span>
                              {botInfo.toInclude[p].from.toLowerCase() === accountAddress.toLowerCase()
                                ? 'Outgoing'
                                : botInfo.toInclude[p].to.toLowerCase() === accountAddress.toLowerCase()
                                ? 'Incoming'
                                : 'Owner'}
                            </span>
                          </td>
                          <td className="table-description text-center dark:text-white">
                            <span>
                              {botInfo.toInclude[p].from === zeroAdd || botInfo.toInclude[p].to === zeroAdd
                                ? 'All'
                                : botInfo.toInclude[p].from.toLowerCase() === accountAddress.toLowerCase()
                                ? formatAddress(botInfo.toInclude[p].to)
                                : botInfo.toInclude[p].from.toLowerCase() === accountAddress.toLowerCase()
                                ? formatAddress(botInfo.toInclude[p].to)
                                : formatAddress(botInfo.toInclude[p].from)}
                            </span>
                          </td>
                          <td className="table-description text-center dark:text-white">
                            <span>
                              {botInfo.toInclude[p].from === zeroAdd || botInfo.toInclude[p].to === zeroAdd
                                ? 'All'
                                : botInfo.toInclude[p].tokenSymbol}
                            </span>
                          </td>
                          <td className="table-description text-center dark:text-white">
                            <span>
                              {botInfo.toInclude[p].from === zeroAdd || botInfo.toInclude[p].to === zeroAdd
                                ? 'All'
                                : ((botInfo.toInclude[p].amountPerSec * secondsByDuration['month']) / 1e20).toFixed(5)}
                            </span>
                          </td>
                          <td className="table-description text-center dark:text-white">
                            <span>
                              {Number(botInfo.toInclude[p].frequency) === Number(secondsByDuration['day'])
                                ? 'Every Day'
                                : Number(botInfo.toInclude[p].frequency) === Number(secondsByDuration['week'])
                                ? 'Every 7 Days'
                                : Number(botInfo.toInclude[p].frequency) === Number(secondsByDuration['biweek'])
                                ? 'Every 14 Days'
                                : Number(botInfo.toInclude[p].frequency) === Number(secondsByDuration['month'])
                                ? 'Every 30 days'
                                : ''}
                            </span>
                          </td>
                          <td className="table-description">
                            <div className="text-center">
                              {botInfo.toInclude[p].owner.toLowerCase() === accountAddress.toLowerCase() && (
                                <button className="row-action-links" onClick={() => handleCancel(p)}>
                                  Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </FormDialog>
    </>
  );
}
