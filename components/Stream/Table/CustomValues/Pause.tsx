import { llamaContractABI } from '~/lib/abis/llamaContract';
import { useTranslations } from 'next-intl';
import useGnosisBatch from '~/queries/useGnosisBatch';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { IStream } from '~/types';
import { LlamaContractInterface } from '~/utils/contract';
import { useContractWrite } from 'wagmi';

interface PauseProps {
  data: IStream;
}

export function Pause({ data }: PauseProps) {
  const [{}, pauseStream] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContractABI,
    },
    'pauseStream',
    {
      args: [data.payeeAddress, data.amountPerSec],
    }
  );
  const { mutate: gnosisBatch } = useGnosisBatch();

  const queryClient = useQueryClient();

  function onPause() {
    if (process.env.NEXT_PUBLIC_SAFE === 'true') {
      const call: { [key: string]: string[] } = {};
      call[data.llamaContractAddress] = [
        LlamaContractInterface.encodeFunctionData('pauseStream', [data.payeeAddress, data.amountPerSec]),
      ];
      gnosisBatch({ calls: call });
    } else {
      pauseStream().then((data) => {
        const loading = data.error ? toast.error(data.error.message) : toast.loading('Pausing Stream');
        data.data?.wait().then((receipt) => {
          toast.dismiss(loading);
          receipt.status === 1 ? toast.success('Stream Paused') : toast.error('Failed to Pause Stream');
          queryClient.invalidateQueries();
        });
      });
    }
  }

  const t = useTranslations('Common');

  return (
    <>
      <button onClick={onPause} className="row-action-links dark:text-white">
        {t('pause')}
      </button>
    </>
  );
}
