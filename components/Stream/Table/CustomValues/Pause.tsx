import llamaContract from 'abis/llamaContract';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import { IStream } from 'types';
import { useContractWrite } from 'wagmi';

interface PauseProps {
  data: IStream;
}

export default function Pause({ data }: PauseProps) {
  const [{}, pauseStream] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContract,
    },
    'pauseStream',
    {
      args: [data.payeeAddress, data.amountPerSec],
    }
  );

  const queryClient = useQueryClient();

  function onPause() {
    pauseStream().then((data) => {
      const loading = data.error ? toast.error(data.error.message) : toast.loading('Pausing Stream');
      data.data?.wait().then((receipt) => {
        toast.dismiss(loading);
        receipt.status === 1 ? toast.success('Stream Paused') : toast.error('Failed to Pause Stream');
        queryClient.invalidateQueries();
      });
    });
  }

  return (
    <>
      <button onClick={onPause} className="row-action-links">
        Pause
      </button>
    </>
  );
}
