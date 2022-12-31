import * as React from 'react';
import { useNetworkProvider } from '~/hooks';
import useStreamsAndHistory from '~/queries/useStreamsAndHistory';
import useBatchCalls from '~/queries/useBatchCalls';
import { useAccount } from 'wagmi';
import { CashIcon } from '@heroicons/react/outline';
import { LlamaContractInterface } from '~/utils/contract';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { useTranslations } from 'next-intl';

interface ICall {
  [key: string]: string[];
}

export default function WithdrawAll() {
  const { data } = useStreamsAndHistory();
  const [{ data: accountData }] = useAccount();
  const { mutate: batchCall } = useBatchCalls();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const { unsupported } = useNetworkProvider();

  const handleClick = () => {
    const calls: ICall =
      data.streams?.reduce((acc: ICall, current) => {
        if (accountData?.address.toLowerCase() === current.payerAddress.toLowerCase() && !current.paused) {
          const callData = acc[current.llamaContractAddress] ?? [];

          callData.push(
            LlamaContractInterface.encodeFunctionData('withdraw', [
              current.payerAddress,
              current.payeeAddress,
              current.amountPerSec,
            ])
          );

          return (acc = { ...acc, [current.llamaContractAddress]: callData });
        }
        return acc;
      }, {}) ?? {};

    if (process.env.NEXT_PUBLIC_SAFE === 'true') {
      gnosisBatch({ calls: calls });
    } else {
      Object.keys(calls).map((p) => {
        batchCall({ llamaContractAddress: p, calls: calls[p] });
      });
    }
  };

  const t = useTranslations('Streams');

  return (
    <button
      onClick={handleClick}
      disabled={!accountData || unsupported}
      className="flex w-full items-center justify-between gap-4 whitespace-nowrap dark:text-white dark:hover:text-[#cccccc]"
    >
      <span>{t('sendAll')}</span>
      <CashIcon className="h-4 w-4" />
    </button>
  );
}
