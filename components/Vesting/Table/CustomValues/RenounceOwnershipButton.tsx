import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';

export default function RenounceOwnershipButton({ data }: { data: IVesting }) {
  const RenounceDialog = useDialogState();
  const { writeAsync: renounce } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: vestingContractReadableABI,
    overrides: {
      gasLimit: 180000 as any,
    },
    functionName: 'renounce_ownership',
  });

  function handleRenounce() {
    renounce?.()
      .then((data) => {
        const toastid = toast.loading('Renouncing');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Renounced') : toast.error('Failed to Renounce');
        });

        RenounceDialog.hide();
      })
      .catch((err) => {
        RenounceDialog.hide();

        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }
  const { address } = useAccount();

  return (
    <>
      {address && data.admin.toLowerCase() === address.toLowerCase() && (
        <button onClick={() => RenounceDialog.show()} className="row-action-links font-exo float-right dark:text-white">
          Renounce
        </button>
      )}
      <FormDialog className="h-min" dialog={RenounceDialog} title={'Clawback'}>
        <span className="font-exo dark:text-white">{'Warning: You will no longer own the contract!'}</span>
        <SubmitButton className="mt-5" onClick={handleRenounce}>
          {'Renounce Ownership'}
        </SubmitButton>
      </FormDialog>
    </>
  );
}
