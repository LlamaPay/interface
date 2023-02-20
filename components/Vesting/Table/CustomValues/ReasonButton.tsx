import * as React from 'react';
import { vestingReasonsABI } from '~/lib/abis/vestingReasons';
import { useDisclosureState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { InputText, SubmitButton } from '~/components/Form';
import { useNetworkProvider } from '~/hooks';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { IVesting } from '~/types';
import { networkDetails } from '~/lib/networkDetails';
import { useAccount, useContractWrite } from 'wagmi';
import { BeatLoader } from 'react-spinners';

export default function ReasonButton({ data }: { data: IVesting }) {
  const { address } = useAccount();

  const { chainId } = useNetworkProvider();
  const { writeAsync: addReason, isLoading } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: networkDetails[chainId ?? 0].vestingReason as `0x${string}`,
    abi: vestingReasonsABI,
    functionName: 'addReason',
  });
  const queryClient = useQueryClient();
  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    addReason({ recklesslySetUnpreparedArgs: [data.contract, form.reason.value] })
      .then((data) => {
        const toastid = toast.loading('Adding Reason');
        dialog.hide();
        data.wait().then((receipt) => {
          toast.dismiss(toastid);
          receipt.status === 1 ? toast.success('Successfully Added Reason') : toast.error('Failed to Add Reason');
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        dialog.hide();

        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }
  const dialog = useDisclosureState();
  return (
    <>
      {address &&
        data.admin.toLowerCase() === address.toLowerCase() &&
        networkDetails[chainId ?? 0].vestingReason !== '0x0000000000000000000000000000000000000000' && (
          <>
            <button onClick={dialog.toggle} className="row-action-links">
              Reason
            </button>
            <FormDialog dialog={dialog} title={'Add Reason'}>
              <span className="space-y-4 text-lp-gray-6 dark:text-white">
                <form className="mx-auto flex flex-col gap-4" onSubmit={onSubmit}>
                  <InputText name="reason" isRequired placeholder="Reason" label="Reason" />
                  <SubmitButton className="mt-5">
                    {isLoading ? <BeatLoader size={6} color="white" /> : 'Add Reason'}
                  </SubmitButton>
                </form>
              </span>
            </FormDialog>
          </>
        )}
    </>
  );
}
