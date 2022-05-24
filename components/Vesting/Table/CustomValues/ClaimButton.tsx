import vestingContractReadable from 'abis/vestingContractReadable';
import { useDialogState } from 'ariakit';
import { TransactionDialog } from 'components/Dialog';
import React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IVesting } from 'types';
import { useContractWrite } from 'wagmi';

export default function ClaimButton({ data }: { data: IVesting }) {
  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const transactionDialog = useDialogState();
  const [{}, claim] = useContractWrite(
    { addressOrName: data.contract, contractInterface: vestingContractReadable },
    'claim'
  );

  function handleClick() {
    claim().then((data) => {
      if (data.error) {
        toast.error(data.error.message);
      }
      if (data.data) {
        const tx = data.data;
        setTransactionHash(tx.hash);
        const toastId = toast.loading('Claiming tokens');
        transactionDialog.toggle();
        tx.wait().then((receipt) => {
          toast.dismiss(toastId);
          receipt.status === 1 ? toast.success('Tokens Claimed Successfully') : toast.error('Failed to Claim Tokens');
          queryClient.invalidateQueries();
        });
      }
    });
  }

  return (
    <>
      <div className="float-right">
        <button onClick={handleClick} className="row-action-links dark:text-white">
          Claim Tokens
        </button>
      </div>
      {transactionHash && <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />}
    </>
  );
}
