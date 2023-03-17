import { llamaContractABI } from '~/lib/abis/llamaContract';
import { useTranslations } from 'next-intl';
import useGnosisBatch from '~/queries/useGnosisBatch';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { IFormattedSalaryStream } from '~/types';
import { LlamaContractInterface } from '~/utils/contract';
import { useContractWrite } from 'wagmi';

interface PauseProps {
  data: IFormattedSalaryStream;
}

export function Pause({ data }: PauseProps) {
  const { writeAsync: pauseStream } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.llamaContractAddress as `0x${string}`,
    abi: llamaContractABI,
    functionName: 'pauseStream',
    args: [data.payeeAddress, data.amountPerSec],
  });
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
      pauseStream()
        .then((data) => {
          const loading = toast.loading('Pausing Stream');
          data.wait().then((receipt) => {
            toast.dismiss(loading);
            receipt.status === 1 ? toast.success('Stream Paused') : toast.error('Failed to Pause Stream');
            queryClient.invalidateQueries();
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
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
