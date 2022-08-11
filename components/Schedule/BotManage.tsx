import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { networkDetails, secondsByDuration } from 'utils/constants';
import { erc20ABI, useContractRead, useContractWrite, useSigner } from 'wagmi';
import botContract from 'abis/botContract';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import useGetBotInfo from 'queries/useGetBotInfo';
import { formatAddress } from 'utils/address';
import { zeroAdd } from 'utils/constants';
import { createWriteContract } from 'utils/contract';

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
    startDate: '',
    frequency: 'daily',
  });
  const [redirectAddress, setRedirectAddress] = React.useState<string | null>(null);

  const { data: botInfo } = useGetBotInfo();
  const [{ data: signer }] = useSigner();

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'balances',
    {
      args: accountAddress,
    }
  );

  const [{}, refund] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'refund'
  );

  const [{}, deposit] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'deposit'
  );
  const [{}, cancelWithdraw] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'cancelWithdraw'
  );

  const [{}, scheduleWithdraw] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'scheduleWithdraw'
  );

  const [{}, setRedirect] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'setRedirect'
  );

  const [{}, cancelRedirect] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'cancelRedirect'
  );

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    deposit({
      overrides: {
        value: (Number(form.amount.value) * 1e18).toString(),
      },
    }).then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Sending ${form.amount.value} ${nativeCurrency} to Bot`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Sent to Bot') : toast.error('Failed to Send to Bot');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function handleRefund() {
    refund().then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Refunding ${Number(balance) / 1e18} ${nativeCurrency}`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Refunded') : toast.error('Failed to Refund');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function handleCancel(p: string) {
    if (!botInfo?.toInclude) return;
    const ele = botInfo.toInclude[p];
    cancelWithdraw({
      args: [ele.llamaPay, ele.token, ele.from, ele.to, ele.amountPerSec, ele.starts, ele.frequency],
    }).then((data) => {
      if (data.error) {
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Cancelling Withdrawal`);
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Cancelled') : toast.error('Failed to Cancel');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }

  function handleSchedule(e: string) {
    const freq = formData.frequency;
    const start = new Date(formData.startDate).getTime() / 1e3;

    scheduleWithdraw({
      args: [
        zeroAdd,
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
    }).then((d) => {
      const data: any = d;
      if (data.error) {
        dialog.hide();
        toast.error(data.error.reason ?? data.error.message);
      } else {
        const toastId = toast.loading('Scheduling Events');
        dialog.hide();
        data.data?.wait().then((receipt: any) => {
          toast.dismiss(toastId);
          receipt.status === 1
            ? toast.success('Successfully Scheduled Events')
            : toast.error('Failed to Schedule Events');
          queryClient.invalidateQueries();
        });
      }
    });
  }

  function onRedirect() {
    setRedirect({ args: redirectAddress }).then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Setting Redirect to ${redirectAddress}`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Set Redirect') : toast.error('Failed to Set Redirect');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  function onCancelRedirect() {
    cancelRedirect().then((data) => {
      if (data.error) {
        dialog.hide();
        toast.error(data.error.message);
      } else {
        const toastid = toast.loading(`Cancelling Redirect`);
        dialog.hide();
        data.data?.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1
            ? toast.success('Successfully Cancelled Redirect')
            : toast.error('Failed to Cancel Redirect');
        });
        queryClient.invalidateQueries();
      }
    });
  }

  async function onApprove(p: string) {
    if (!botInfo?.toInclude || !signer) return;
    const contract = createWriteContract(botInfo?.toInclude[p].token, signer);
    await contract.approve(
      botAddress,
      '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    );
  }

  return (
    <>
      <FormDialog dialog={dialog} title="Manage Bot" className="h-min min-w-fit	">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <div className="flex space-x-2">
            <span>{`Balance: ${(Number(balance) / 1e18).toFixed(5)} ${nativeCurrency}`}</span>
            <button className="row-action-links" onClick={handleRefund}>
              Refund
            </button>
          </div>
          <section>
            <form onSubmit={onSubmit}>
              <div className="flex space-x-2">
                <div className="w-full">
                  <InputAmount name="amount" isRequired label="Amount to Deposit" />
                </div>
                <SubmitButton className="bottom-0 h-min w-1/2 place-self-end">Deposit</SubmitButton>
              </div>
            </form>
          </section>
          <section>
            <form onSubmit={onRedirect}>
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

              <div className="flex space-x-2">
                <div className="w-full">
                  <InputText
                    name="redirectTo"
                    pattern="/^0x[a-fA-F0-9]{40}$/"
                    isRequired
                    label="Redirect Withdrawals To"
                    placeholder="0x..."
                    handleChange={(e) => setRedirectAddress(e.target.value)}
                  />
                </div>
                <SubmitButton className="bottom-0 h-min w-1/2 place-self-end">Redirect</SubmitButton>
              </div>
            </form>
          </section>
          <section className="border px-2 py-2">
            <h1 className="pb-1">Schedule for All Streams:</h1>
            <div className="space-y-2">
              <InputText
                label="Starts (YYYY-MM-DD)"
                name="startDate"
                isRequired
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                handleChange={(e) => handleChange(e.target.value, 'startDate')}
              />
              <div>
                <label className="input-label">Frequency</label>
                <select onChange={(e) => handleChange(e.target.value, 'frequency')} className="input-field w-full">
                  <option value="daily">Every Day</option>
                  <option value="weekly">Every 7 Days</option>
                  <option value="biweekly">Every 14 Days</option>
                  <option value="monthly">Every 30 Days</option>
                </select>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => handleSchedule('incoming')}
                  className="place-self-end rounded-3xl border bg-white px-3 py-[6px] text-sm dark:border-[#252525] dark:bg-[#252525]"
                >
                  Incoming
                </button>
                <button
                  onClick={(e) => handleSchedule('outgoing')}
                  className="place-self-end rounded-3xl border bg-white px-3 py-[6px] text-sm dark:border-[#252525] dark:bg-[#252525]"
                >
                  Outgoing
                </button>
              </div>
            </div>
          </section>
          {botInfo?.toInclude && (
            <div className="overflow-x-auto">
              <table className="border">
                <thead>
                  <tr>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">Type</th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Address Related
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">Token</th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Amount/Month
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Frequency
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(botInfo.toInclude).map((p) => (
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
                          {botInfo.toInclude[p].frequency === secondsByDuration['day']
                            ? 'Every Day'
                            : botInfo.toInclude[p].frequency === secondsByDuration['week']
                            ? 'Every 7 Days'
                            : botInfo.toInclude[p].frequency === secondsByDuration['biweek']
                            ? 'Every 14 Days'
                            : botInfo.toInclude[p].frequency === secondsByDuration['month']
                            ? 'Every 30 days'
                            : ''}
                        </span>
                      </td>
                      <td className="table-description">
                        <div className="flex space-x-1 text-center">
                          <button className="row-action-links" onClick={(e) => onApprove(p)}>
                            Approve
                          </button>
                          {botInfo.toInclude[p].owner.toLowerCase() === accountAddress.toLowerCase() && (
                            <button className="row-action-links" onClick={(e) => handleCancel(p)}>
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
          )}
        </span>
      </FormDialog>
    </>
  );
}
