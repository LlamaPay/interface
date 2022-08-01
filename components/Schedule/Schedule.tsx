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

interface IScheduleElements {
  startDate: { value: string };
  frequency: { value: string };
}

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
    frequency: '',
  });

  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IScheduleElements;
    const start = new Date(form.startDate.value).getTime() / 1e3;
    const freq = form.frequency.value;
    scheduleWithdraw({
      args: [
        data.llamaContractAddress,
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
              <InputText
                label="Starts (YYYY-MM-DD)"
                name="startDate"
                isRequired
                placeholder="YYYY-MM-DD"
                pattern="\d{4}-\d{2}-\d{2}"
                handleChange={(e) => handleChange(e.target.value, 'startDate')}
              />
              <SubmitButton className="mt-5">Schedule</SubmitButton>
            </section>
          </form>
        </span>
      </FormDialog>
    </>
  );
}
