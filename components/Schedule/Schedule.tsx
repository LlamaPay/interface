import * as React from 'react';
import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { InputText, SubmitButton } from 'components/Form';
import { IStream } from 'types';
import { useAccount, useContractWrite } from 'wagmi';
import { networkDetails, secondsByDuration } from 'utils/constants';
import botContract from 'abis/botContract';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Switch } from '@headlessui/react';
import { useApproveTokenForMaxAmt } from 'queries/useTokenApproval';
import BotDepositWarning from './BotDepositWarning';

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
  const warningDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const botAddress = networkDetails[chainId].botAddress;
  const queryClient = useQueryClient();
  const [hasRedirect, setHasRedirect] = React.useState<boolean>(false);
  const [redirectAddress, setRedirectAddress] = React.useState<string | null>(null);
  const { mutate: approveMax } = useApproveTokenForMaxAmt();

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

  const [formData, setFormData] = React.useState({
    startDate: new Date(Date.now()).toISOString().slice(0, 10),
    frequency: 'daily',
  });

  function handleChange(value: string, type: keyof typeof formData) {
    setFormData((prev) => ({ ...prev, [type]: value }));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const start = (new Date(formData.startDate).getTime() / 1e3).toFixed(0);
    const freq = formData.frequency;
    dialog.hide();
    warningDialog.show();
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
        toast.error(data.error.reason ?? data.error.message);
      } else {
        const toastId = toast.loading('Scheduling Event');
        data.data?.wait().then((receipt: any) => {
          toast.dismiss(toastId);
          receipt.status === 1
            ? toast.success('Successfully Scheduled Event')
            : toast.error('Failed to Schedule Event');
          queryClient.invalidateQueries();
        });
      }
    });
    if (!hasRedirect) {
      return;
    } else {
      approveMax({ tokenAddress: data.token.address, spenderAddress: botAddress });
      setRedirect({ args: [redirectAddress] }).then((data) => {
        if (data.error) {
          toast.error(data.error.message);
        } else {
          const toastId = toast.loading('Setting Redirect');
          data.data?.wait().then((receipt: any) => {
            toast.dismiss(toastId);
            receipt.status === 1 ? toast.success('Successfully Set Redirect') : toast.error('Failed to Set Redirect');
            queryClient.invalidateQueries();
          });
        }
      });
    }
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
              <div className="w-full space-y-1">
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
                {data.payeeAddress.toLowerCase() === accountData?.address.toLowerCase() && (
                  <div className="flex space-x-1">
                    <span>Redirect Withdraw</span>
                    <Switch
                      checked={hasRedirect}
                      onChange={setHasRedirect}
                      className={`${
                        hasRedirect ? 'bg-[#23BD8F]' : 'bg-gray-200 dark:bg-[#252525]'
                      } relative inline-flex h-6 w-11 items-center rounded-full`}
                    >
                      <span
                        className={`${
                          hasRedirect ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white`}
                      />
                    </Switch>
                  </div>
                )}
                {hasRedirect && (
                  <div className="w-full">
                    <InputText
                      name="redirectTo"
                      isRequired
                      label="Redirect Withdrawals To"
                      placeholder="0x..."
                      handleChange={(e) => setRedirectAddress(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <SubmitButton className="mt-5">Schedule</SubmitButton>
            </section>
          </form>
        </span>
      </FormDialog>
      <BotDepositWarning
        botAddress={botAddress}
        dialog={warningDialog}
        userAddress={accountData?.address ?? ''}
        nativeCurrency={nativeCurrency}
      />
    </>
  );
}
