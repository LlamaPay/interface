import * as React from 'react';
import llamaContract from 'abis/llamaContract';
import { useDialogState } from 'ariakit';
import { TransactionDialog } from 'components/Dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface PushProps {
  buttonName: string;
  data: IStream;
}

export const Push = ({ data, buttonName }: PushProps) => {
  const [transactionHash, setTransactionHash] = React.useState(null);

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

  const queryClient = useQueryClient();

  const transactionDialog = useDialogState();

  const handleClick = () => {
    withdraw().then(({ data, error }: any) => {
      if (data) {
        setTransactionHash(data.hash ?? null);

        transactionDialog.toggle();

        const toastId = toast.loading(buttonName === 'Withdraw' ? 'Withdrawing Payment' : 'Sending Payment');

        data.wait().then((receipt: any) => {
          toast.dismiss(toastId);

          queryClient.invalidateQueries();

          receipt.status === 1
            ? toast.success(buttonName === 'Withdraw' ? 'Successfully Withdrawn Payment' : 'Successfully Sent Payment')
            : toast.error(buttonName === 'Withdraw' ? 'Failed to Withdraw Payment' : 'Failed to Send Payment');
        });
      }

      if (error) {
        toast.error(error.message);
      }
    });
  };

  return (
    <>
      <button onClick={handleClick} className="row-action-links">
        {buttonName}
      </button>

      {transactionHash && <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash || ''} />}
    </>
  );
};
