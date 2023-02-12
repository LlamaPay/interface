import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';

export default function RenounceOwnershipButton({ data }: { data: IVesting }) {
  const RenounceDialog = useDialogState();
  const [{}, renounce] = useContractWrite(
    {
      addressOrName: data.contract,
      contractInterface: vestingContractReadableABI,
    },
    'renounce_ownership',
    {
      overrides: {
        gasLimit: 180000,
      },
    }
  );

  function handleRenounce() {
    renounce().then((data) => {
      if (data.error) {
        toast.error('Failed to Renounce');
      } else {
        const toastid = toast.loading('Renouncing');
        data.data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Renounced') : toast.error('Failed to Renounce');
        });
      }
      RenounceDialog.hide();
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
