import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import toast from 'react-hot-toast';
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

  const handleClick = () => {
    cancel().then((data) => {
      data.error ? toast('Error!') : toast('Cancelling');
      data.data?.wait().then((receipt) => {
        receipt.status === 1 ? toast('Cancelled') : toast('Failed to Cancel');
      });
    });
  };

  return (
    <>
      <button onClick={handleClick} className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800">
        Cancel
      </button>
    </>
  );
};
