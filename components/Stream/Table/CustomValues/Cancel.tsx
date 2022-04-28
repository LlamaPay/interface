import llamaContract from 'abis/llamaContract';
import { Interface } from 'ethers/lib/utils';
import useBatchCalls from 'queries/useBatchCalls';
import * as React from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface CancelProps {
  data: IStream;
}

const CreateInterface = new Interface(['function createStream(address to, uint216 amountPerSec)']);
const CancelInterface = new Interface(['function cancelStream(address to, uint216 amountPerSec)']);

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

  const queryClient = useQueryClient();
  const { mutate: batchCall } = useBatchCalls();

  const handleClick = () => {
    if (data.paused) {
      batchCall({
        llamaContractAddress: data.llamaContractAddress,
        calls: [
          CreateInterface.encodeFunctionData('createStream', [data.payeeAddress, data.amountPerSec]),
          CancelInterface.encodeFunctionData('cancelStream', [data.payeeAddress, data.amountPerSec]),
        ],
      });
    } else {
      cancel().then((data) => {
        const loadingToast = data.error ? toast.error(data.error.message) : toast.loading('Cancelling Stream');
        data.data?.wait().then((receipt) => {
          toast.dismiss(loadingToast);
          receipt.status === 1 ? toast.success('Stream Cancelled') : toast.error('Failed to Cancel Stream');
          queryClient.invalidateQueries();
        });
      });
    }
  };

  return (
    <>
      <button onClick={handleClick} className="row-action-links text-[#E40000]">
        Cancel
      </button>
    </>
  );
};
