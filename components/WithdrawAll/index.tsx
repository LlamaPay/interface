import * as React from 'react';
import { useNetworkProvider } from '~/hooks';
import useBatchCalls from '~/queries/useBatchCalls';
import { useAccount, useNetwork } from 'wagmi';
import { BanknotesIcon } from '@heroicons/react/24/outline';
import { LlamaContractInterface } from '~/utils/contract';
import useGnosisBatch from '~/queries/useGnosisBatch';
import { useTranslations } from 'next-intl';
import { useGetSalaryInfo } from '~/queries/salary/useGetSalaryInfo';

interface ICall {
  [key: string]: string[];
}

export default function WithdrawAll() {
  const { address } = useAccount();

  const { chain } = useNetwork();

  const { data } = useGetSalaryInfo({ userAddress: address, chainId: chain?.id });

  const { mutate: batchCall } = useBatchCalls();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const { unsupported } = useNetworkProvider();

  const handleClick = () => {
    const calls: ICall =
      data?.salaryStreams?.reduce((acc: ICall, current) => {
        if (address && address.toLowerCase() === current.payerAddress.toLowerCase() && !current.paused) {
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
      disabled={!address || unsupported}
      className="flex w-full items-center justify-between gap-4 whitespace-nowrap dark:text-white dark:hover:text-[#cccccc]"
    >
      <span>{t('sendAll')}</span>
      <BanknotesIcon className="h-4 w-4" />
    </button>
  );
}
