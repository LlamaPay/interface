import botContract from 'abis/botContract';
import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { InputAmount, SubmitButton } from 'components/Form';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { useContractRead, useContractWrite } from 'wagmi';

export default function BotDepositWarning({
  botAddress,
  dialog,
  userAddress,
  nativeCurrency,
}: {
  botAddress: string;
  dialog: DisclosureState;
  userAddress: string;
  nativeCurrency: string;
}) {
  const queryClient = useQueryClient();
  const [{ data: balance }] = useContractRead(
    {
      addressOrName: botAddress,
      contractInterface: botContract,
    },
    'balances',
    {
      args: userAddress,
    }
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
        value: (Number(form.amount.value) * 1e18).toFixed(0),
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
  return (
    <>
      <FormDialog dialog={dialog} title="Deposit Into Bot" className="h-min">
        <span className="space-y-4 text-[#303030] dark:text-white">
          <span>{`Balance: ${(Number(balance) / 1e18).toFixed(5)} ${nativeCurrency}`}</span>
          <div>
            <span>{'Bot requires funds to pay for gas. Please add funds!'}</span>
          </div>
          <form onSubmit={onSubmit}>
            <div className="flex space-x-2">
              <div className="w-full">
                <InputAmount name="amount" isRequired label="Amount to Deposit" />
              </div>
            </div>
            <SubmitButton className="mt-5">Deposit</SubmitButton>
          </form>
        </span>
      </FormDialog>
    </>
  );
}
