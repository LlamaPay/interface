import { llamaContractABI } from '~/lib/abis/llamaContract';
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import type { IStream } from '~/types';
import { useContractWrite } from 'wagmi';

interface ResumeProps {
  data: IStream;
}

export function Resume({ data }: ResumeProps) {
  const { writeAsync: createStreamWithReason } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.llamaContractAddress as `0x${string}`,
    abi: llamaContractABI,
    functionName: 'createStreamWithReason',
    args: [data.payeeAddress, data.amountPerSec, data.reason ? data.reason : ''],
  });

  const { writeAsync: createStream } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: data.llamaContractAddress as `0x${string}`,
    abi: llamaContractABI,
    functionName: 'createStream',
    args: [data.payeeAddress, data.amountPerSec],
  });

  const queryClient = useQueryClient();

  function onResume() {
    if (data.reason !== null && data.reason !== undefined) {
      createStreamWithReason()
        .then((data) => {
          const loading = toast.loading('Resuming Stream');
          data.wait().then((receipt) => {
            toast.dismiss(loading);
            receipt.status === 1 ? toast.success('Stream Resumed') : toast.error('Failed to Resume Stream');
            queryClient.invalidateQueries();
          });
        })
        .catch((err) => {
          toast.error(err.reason || err.message || 'Transaction Failed');
        });
    } else {
      createStream()
        .then((data) => {
          const loading = toast.loading('Resuming Stream');
          data.wait().then((receipt) => {
            toast.dismiss(loading);
            receipt.status === 1 ? toast.success('Stream Resume') : toast.error('Failed to Resume Stream');
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
    <button onClick={onResume} className="row-action-links dark:text-white">
      {t('resume')}
    </button>
  );
}
