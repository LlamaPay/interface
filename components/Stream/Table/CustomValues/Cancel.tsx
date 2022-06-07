import * as React from 'react';
import llamaContract from 'abis/llamaContract';
import { useDialogState } from 'ariakit';
import { TransactionDialog } from 'components/Dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';
import { Interface } from 'ethers/lib/utils';
import useBatchCalls from 'queries/useBatchCalls';
import { useTranslations } from 'next-intl';
import { LlamaContractInterface } from 'utils/contract';
import useGnosisBatch from 'queries/useGnosisBatch';

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

  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);

  const transactionDialog = useDialogState();

  const queryClient = useQueryClient();
  const { mutate: batchCall } = useBatchCalls();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const handleClick = () => {
    if (data.paused) {
      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        const calls: { [key: string]: string[] } = {};
        calls[data.llamaContractAddress] = [
          LlamaContractInterface.encodeFunctionData('createStream', [data.payeeAddress, data.amountPerSec]),
          LlamaContractInterface.encodeFunctionData('cancelStream', [data.payeeAddress, data.amountPerSec]),
        ];
        gnosisBatch({ calls: calls });
      } else {
        batchCall({
          llamaContractAddress: data.llamaContractAddress,
          calls: [
            CreateInterface.encodeFunctionData('createStream', [data.payeeAddress, data.amountPerSec]),
            CancelInterface.encodeFunctionData('cancelStream', [data.payeeAddress, data.amountPerSec]),
          ],
        });
      }
    } else {
      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        const calls: { [key: string]: string[] } = {};
        calls[data.llamaContractAddress] = [
          LlamaContractInterface.encodeFunctionData('cancelStream', [data.payeeAddress, data.amountPerSec]),
        ];
        gnosisBatch({ calls: calls });
      } else {
        cancel().then(({ data, error }) => {
          if (error) {
            toast.error(error.message);
          }

          if (data) {
            setTransactionHash(data.hash);
            const toastid = toast.loading('Cancelling Stream');
            data?.wait().then((receipt) => {
              toast.dismiss(toastid);
              receipt.status === 1 ? toast.success('Stream Cancelled') : toast.error('Failed to Cancel Stream');
              queryClient.invalidateQueries();
            });
          }
        });
      }
    }
  };

  const t = useTranslations('Streams');

  return (
    <>
      <button onClick={handleClick} className="row-action-links w-full text-right">
        {t('cancel')}
      </button>
      {transactionHash && <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />}
    </>
  );
};
