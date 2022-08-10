import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { networkDetails, secondsByDuration } from 'utils/constants';
import { useContractRead, useContractWrite } from 'wagmi';
import botContract from 'abis/botContract';
import { InputAmount, InputText, SubmitButton } from 'components/Form';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import useGetBotInfo from 'queries/useGetBotInfo';
import { formatAddress } from 'utils/address';
import { zeroAdd } from 'utils/constants';
import useGetRedirectInfo from 'queries/useGetRedirectInfo';

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

  const { data: botInfo } = useGetBotInfo();
  const { data: redirectInfo } = useGetRedirectInfo();

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
    if (botInfo === undefined) return;
    const ele = botInfo[p];
    cancelWithdraw({ args: [ele.llamaPay, ele.from, ele.to, ele.amountPerSec, ele.starts, ele.frequency] }).then(
      (data) => {
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
      }
    );
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
          {botInfo && (
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
                  {Object.keys(botInfo).map((p) => (
                    <tr key={p} className="table-row">
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].from.toLowerCase() === accountAddress.toLowerCase()
                            ? 'Outgoing'
                            : botInfo[p].to.toLowerCase() === accountAddress.toLowerCase()
                            ? 'Incoming'
                            : 'Owner'}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].from === zeroAdd || botInfo[p].to === zeroAdd
                            ? 'All'
                            : botInfo[p].from.toLowerCase() === accountAddress.toLowerCase()
                            ? formatAddress(botInfo[p].to)
                            : botInfo[p].from.toLowerCase() === accountAddress.toLowerCase()
                            ? formatAddress(botInfo[p].to)
                            : formatAddress(botInfo[p].from)}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].from === zeroAdd || botInfo[p].to === zeroAdd ? 'All' : botInfo[p].token}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].from === zeroAdd || botInfo[p].to === zeroAdd
                            ? 'All'
                            : ((botInfo[p].amountPerSec * secondsByDuration['month']) / 1e20).toFixed(5)}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {botInfo[p].frequency === secondsByDuration['day']
                            ? 'Every Day'
                            : botInfo[p].frequency === secondsByDuration['week']
                            ? 'Every 7 Days'
                            : botInfo[p].frequency === secondsByDuration['biweek']
                            ? 'Every 14 Days'
                            : botInfo[p].frequency === secondsByDuration['month']
                            ? 'Every 30 days'
                            : ''}
                        </span>
                      </td>
                      <td className="table-description">
                        <div className="text-center">
                          {botInfo[p].owner.toLowerCase() === accountAddress.toLowerCase() ? (
                            <button className="row-action-links" onClick={(e) => handleCancel(p)}>
                              Cancel
                            </button>
                          ) : (
                            ''
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {redirectInfo && (
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
                      Amount to Send
                    </th>
                    <th className="table-description text-sm font-semibold !text-[#3D3D3D] dark:!text-white">
                      Frequency
                    </th>
                    <th className="table-description align-right text-sm font-semibold !text-[#3D3D3D] dark:!text-white"></th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(redirectInfo).map((p) => (
                    <tr key={p} className="table-row">
                      <td className="table-description text-center dark:text-white">Redirect</td>
                      <td className="table-description text-center dark:text-white">
                        <span>{formatAddress(redirectInfo[p].to)}</span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>{redirectInfo[p].token}</span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>{redirectInfo[p].amount / 10 ** redirectInfo[p].decimals}</span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <span>
                          {redirectInfo[p].frequency === secondsByDuration['day']
                            ? 'Every Day'
                            : redirectInfo[p].frequency === secondsByDuration['week']
                            ? 'Every 7 Days'
                            : redirectInfo[p].frequency === secondsByDuration['biweek']
                            ? 'Every 14 Days'
                            : redirectInfo[p].frequency === secondsByDuration['month']
                            ? 'Every 30 days'
                            : ''}
                        </span>
                      </td>
                      <td className="table-description text-center dark:text-white">
                        <button className="row-action-links" onClick={(e) => handleCancel(p)}>
                          Cancel
                        </button>
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
