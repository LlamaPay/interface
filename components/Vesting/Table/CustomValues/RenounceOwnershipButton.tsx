import { useQueryClient } from '@tanstack/react-query';
import { useDialogState } from 'ariakit';
import toast from 'react-hot-toast';
import { BeatLoader } from '~/components/BeatLoader';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { vestingContractReadableABI, vestingContractV2ReadableABI } from '~/lib/abis/vestingContractReadable';
import { IVesting } from '~/types';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';

export default function RenounceOwnershipButton({ data }: { data: IVesting }) {
  const { chainId } = useNetworkProvider();
  const isV2 =
    chainId &&
    networkDetails[chainId]?.vestingFactory_v2 &&
    data.factory === networkDetails[chainId].vestingFactory_v2?.toLowerCase()
      ? true
      : false;
  const RenounceDialog = useDialogState();
  const { writeAsync: renounce, isLoading } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: isV2 ? vestingContractV2ReadableABI : vestingContractReadableABI,
    functionName: isV2 ? 'disown' : 'renounce_ownership',
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
        <span className="font-exo text-center dark:text-white">{'Warning: You will no longer own the contract!'}</span>
        <SubmitButton className="mt-5" onClick={handleRenounce} disabled={isLoading}>
          {isLoading ? <BeatLoader size="6px" color="white" /> : 'Renounce Ownership'}
        </SubmitButton>
      </FormDialog>
    </>
  );
}
