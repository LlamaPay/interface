import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import toast from 'react-hot-toast';
import type { IVesting } from '~/types';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { useDialogState } from 'ariakit';
import { SubmitButton } from '~/components/Form';

export default function RugpullVestingButton({ data }: { data: IVesting }) {
  const RugDialog = useDialogState();

  const [{}, rug_pull] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadableABI,
    },
    'rug_pull',
    {
      overrides: {
        gasLimit: 180000,
      },
    }
  );

  function handleRugpull() {
    rug_pull().then((data) => {
      if (data.error) {
        toast.error('Failed to Rug');
      } else {
        const toastid = toast.loading('Rugging');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Rugged') : toast.error('Failed to Rug');
        });
      }
      RugDialog.hide();
    });
  }
  const [{ data: accountData }] = useAccount();
  return (
    <>
      {data.admin.toLowerCase() === accountData?.address.toLowerCase() && (
        <button onClick={() => RugDialog.show()} className="row-action-links font-exo float-right dark:text-white">
          Rug
        </button>
      )}
      <FormDialog className="h-min" dialog={RugDialog} title={'Clawback'}>
        <span className="font-exo dark:text-white">{'Warning: This will clawback vesting from the recipient!'}</span>
        <SubmitButton className="mt-5" onClick={handleRugpull}>
          {'Rug'}
        </SubmitButton>
      </FormDialog>
    </>
  );
}
