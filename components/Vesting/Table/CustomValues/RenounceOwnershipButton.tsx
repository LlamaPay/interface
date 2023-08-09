import { useQueryClient } from '@tanstack/react-query';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { BeatLoader } from '~/components/BeatLoader';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';

export default function RenounceOwnershipButton({ data }: { data: IVesting }) {
  const RenounceDialog = useDialogState();
  const { writeAsync: renounce, isLoading } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: vestingContractReadableABI,
    overrides: {
      gasLimit: 500000 as any,
    },
    functionName: 'renounce_ownership',
  });

  const queryClient = useQueryClient();

  function handleRenounce() {
    renounce?.()
      .then((data) => {
        const toastid = toast.loading('Renouncing');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Renounced') : toast.error('Failed to Renounce');
          queryClient.invalidateQueries();
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
          Renounce Owneship
        </button>
      )}
      <FormDialog className="h-min" dialog={RenounceDialog} title={'Renounce Ownership'}>
        <span className="font-exo dark:text-white">{'Warning: You will no longer own the contract!'}</span>
        <SubmitButton className="mt-5" onClick={handleRenounce}>
          {isLoading ? <BeatLoader size="6px" color="white" /> : 'Renounce Ownership'}
        </SubmitButton>
      </FormDialog>
    </>
  );
}
