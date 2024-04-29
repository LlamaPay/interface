import { vestingContractReadableABI, vestingContractV2ReadableABI } from '~/lib/abis/vestingContractReadable';
import toast from 'react-hot-toast';
import type { IVesting } from '~/types';
import { useAccount, useContractWrite } from 'wagmi';
import { FormDialog } from '~/components/Dialog';
import { useDialogState } from 'ariakit';
import { SubmitButton } from '~/components/Form';
import { useQueryClient } from '@tanstack/react-query';
import { BeatLoader } from '~/components/BeatLoader';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';

export default function RugpullVestingButton({ data }: { data: IVesting }) {
  const { chainId } = useNetworkProvider();
  const isV2 =
    chainId &&
    networkDetails[chainId]?.vestingFactory_v2 &&
    data.factory === networkDetails[chainId].vestingFactory_v2?.toLowerCase()
      ? true
      : false;
  const RugDialog = useDialogState();

  const { writeAsync: rug_pull, isLoading } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.contract as `0x${string}`,
    abi: isV2 ? vestingContractV2ReadableABI : vestingContractReadableABI,
    functionName: isV2 ? 'revoke' : 'rug_pull',
  });

  const queryClient = useQueryClient();

  function handleRugpull() {
    rug_pull()
      .then((data) => {
        const toastid = toast.loading('Rugging');
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Rugged') : toast.error('Failed to Rug');
          queryClient.invalidateQueries();
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
          Revoke
        </button>
      )}
      <FormDialog className="h-min" dialog={RugDialog} title={'Clawback'}>
        <span className="font-exo dark:text-white">{`Warning: This will clawback vesting from the recipient: ${data.recipient}!`}</span>
        <SubmitButton className="mt-5" onClick={handleRugpull}>
          {isLoading ? <BeatLoader size="6px" color="white" /> : 'Rug'}
        </SubmitButton>
      </FormDialog>
    </>
  );
}
