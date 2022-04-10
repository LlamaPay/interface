import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import toast from 'react-hot-toast';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface PushProps {
  buttonName: string;
  data: IStream;
}

export const Push = ({ data, buttonName }: PushProps) => {
  const [{}, withdraw] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'withdraw',
    {
      args: [data.payerAddress, data.payeeAddress, data.amountPerSec],
    }
  );

  const handleClick = () => {
    withdraw().then((data) => {
      const loadingToast = data.error
        ? toast.error(data.error?.message)
        : toast.loading(buttonName === 'Withdraw' ? 'Withdrawing Payment' : 'Sending Payment');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loadingToast);
        receipt.status === 1
          ? toast.success(buttonName === 'Withdraw' ? 'Successfully Withdrawn Payment' : 'Successfully Sent Payment')
          : toast.error(buttonName === 'Withdraw' ? 'Failed to Withdraw Payment' : 'Failed to Send Payment');
      });
    });
  };

  return (
    <>
      <button onClick={handleClick} className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800">
        {buttonName}
      </button>
    </>
  );
};
