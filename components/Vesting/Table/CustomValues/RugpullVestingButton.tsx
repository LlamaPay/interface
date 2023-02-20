import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import toast from 'react-hot-toast';
import type { IVesting } from '~/types';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { useDialogState } from 'ariakit';
import { SubmitButton } from '~/components/Form';

export default function RugpullVestingButton({ data }: { data: IVesting }) {
  const RugDialog = useDialogState();

  const { writeAsync: rug_pull } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: vestingContractReadableABI,
    functionName: 'rug_pull',
    overrides: {
      gasLimit: 180000 as any,
    },
  });

  function handleRugpull() {
    rug_pull()
      .then((data) => {
        const toastid = toast.loading('Rugging');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Rugged') : toast.error('Failed to Rug');
        });

        RugDialog.hide();
      })
      .catch((err) => {
        RugDialog.hide();

        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }
  const { address } = useAccount();

  return (
    <>
      {address && data.admin.toLowerCase() === address.toLowerCase() && (
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
