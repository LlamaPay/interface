import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { InputText, SubmitButton } from 'components/Form';
import { IStream } from 'types';
import { useAccount, useContractRead, useContractWrite } from 'wagmi';
import { networkDetails, secondsByDuration } from 'utils/constants';
import botContract from 'abis/botContract';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

export default function Schedule({
  data,
  chainId,
  nativeCurrency,
}: {
  data: IStream;
  chainId: number;
  nativeCurrency: string;
}) {
  const dialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const botAddress = networkDetails[chainId].botAddress;
  const queryClient = useQueryClient();

  const [{ data: balance }] = useContractRead(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'balances',
    {
      args: accountData?.address,
    }
  );

  const [{}, scheduleWithdraw] = useContractWrite(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'scheduleWithdraw'
  );

  const [formData, setFormData] = React.useState({
    startDate: '',
    frequency: 'daily',
  });

  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const start = (new Date(formData.startDate).getTime() / 1e3).toFixed(0);
    const freq = formData.frequency;
    scheduleWithdraw({
      args: [
        data.llamaContractAddress,
        data.token.address,
        data.payerAddress,
        data.payeeAddress,
        data.amountPerSec,
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
        const toastId = toast.loading('Scheduling Event');
        dialog.hide();
        data.data?.wait().then((receipt: any) => {
          toast.dismiss(toastId);
          receipt.status === 1
            ? toast.success('Successfully Scheduled Event')
            : toast.error('Failed to Schedule Event');
          queryClient.invalidateQueries();
        });
      }
    });
  }

  function onCurrentDate() {
    setFormData((prev) => ({ ...prev, ['startDate']: new Date(Date.now()).toISOString().slice(0, 10) }));
  }

  return (
    <>
      <button onClick={dialog.toggle} className="row-action-links w-full text-right">
        Schedule
      </button>
      <FormDialog dialog={dialog} title={'Schedule Withdraw'} className="h-min">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <form className="mx-auto flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
            <span>{`Balance: ${(Number(balance) / 1e18).toFixed(5)} ${nativeCurrency}`}</span>
            <div>
              <label className="input-label">Frequency</label>
              <select name="frequency" className="input-field w-full">
                <option value="daily">Every Day</option>
                <option value="weekly">Every 7 Days</option>
                <option value="biweekly">Every 14 Days</option>
                <option value="monthly">Every 30 Days</option>
              </select>
            </div>
            <section>
              <div className="w-full">
                <label className="input-label">Start Date</label>
                <div className="relative flex">
                  <input
                    className="input-field"
                    onChange={(e) => handleChange(e.target.value, 'startDate')}
                    required
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
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
              </div>
              <SubmitButton className="mt-5">Schedule</SubmitButton>
            </section>
          </form>
        </span>
      </FormDialog>
    </>
  );
}
