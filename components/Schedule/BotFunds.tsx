import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { networkDetails } from 'utils/constants';
import { useContractRead, useContractWrite } from 'wagmi';
import botContract from 'abis/botContract';
import { InputAmount, SubmitButton } from 'components/Form';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

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
  if (!chainId || !accountAddress) {
  }
  const botAddress = networkDetails[chainId].botAddress;
  const queryClient = useQueryClient();

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

  return (
    <>
      <FormDialog dialog={dialog} title="Manage Bot Funds" className="h-min">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <div className="flex space-x-2">
            <span>{`Balance: ${Number(balance) / 1e18} ${nativeCurrency}`}</span>
            <button className="row-action-links" onClick={handleRefund}>
              Refund
            </button>
          </div>
          <section>
            <form onSubmit={onSubmit}>
              <InputAmount name="amount" isRequired label="Amount to Deposit" />
              <SubmitButton className="mt-5">Deposit</SubmitButton>
            </form>
          </section>
        </span>
      </FormDialog>
    </>
  );
}
