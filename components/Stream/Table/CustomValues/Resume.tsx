import llamaContract from 'abis/llamaContract';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface ResumeProps {
  data: IStream;
}

export default function Resume({ data }: ResumeProps) {
  const [{}, createStreamWithReason] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'createStreamWithReason',
    {
      args: [data.payeeAddress, data.amountPerSec, data.reason ? data.reason : ''],
    }
  );

  const [{}, createStream] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'createStream',
    {
      args: [data.payeeAddress, data.amountPerSec],
    }
  );

  const queryClient = useQueryClient();

  function onResume() {
    if (data.reason !== null && data.reason !== undefined) {
      createStreamWithReason().then((data) => {
        const loading = data.error ? toast.error(data.error.message) : toast.loading('Resuming Stream');
        data.data?.wait().then((receipt) => {
          toast.dismiss(loading);
          receipt.status === 1 ? toast.success('Stream Resumed') : toast.error('Failed to Resume Stream');
          queryClient.invalidateQueries();
        });
      });
    } else {
      createStream().then((data) => {
        const loading = data.error ? toast.error(data.error.message) : toast.loading('Resuming Stream');
        data.data?.wait().then((receipt) => {
          toast.dismiss(loading);
          receipt.status === 1 ? toast.success('Stream Resume') : toast.error('Failed to Resume Stream');
          queryClient.invalidateQueries();
        });
      });
    }
  }

  return (
    <button onClick={onResume} className="row-action-links">
      Resume
    </button>
  );
}
