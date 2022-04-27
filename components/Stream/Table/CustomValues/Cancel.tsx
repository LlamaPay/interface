import * as React from 'react';
import llamaContract from 'abis/llamaContract';
import { useDialogState } from 'ariakit';
import { TransactionDialog } from 'components/Dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface CancelProps {
  data: IStream;
}

export const Cancel = ({ data }: CancelProps) => {
  const [{}, cancel] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'cancelStream',
    {
      args: [data.payeeAddress, data.amountPerSec],
    }
  );

  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);

  const transactionDialog = useDialogState();

  const queryClient = useQueryClient();

  const handleClick = () => {
    cancel().then(({ data, error }: any) => {
      if (error) {
        toast.error(error.message);
      }

      if (data) {
        setTransactionHash(data.hash ?? null);

        transactionDialog.toggle();

        const toastId = toast.loading('Cancelling Stream');

        data.wait().then((receipt: any) => {
          toast.dismiss(toastId);

          receipt.status === 1 ? toast.success('Stream Cancelled') : toast.error('Failed to Cancel Stream');

          queryClient.invalidateQueries();
        });
      }
    });
  };

  return (
    <>
      <button onClick={handleClick} className="row-action-links text-[#E40000]">
        Cancel
      </button>
      {transactionHash && <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash || ''} />}
    </>
  );
};
