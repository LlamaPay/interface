import { Interface } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import useBatchCalls from 'queries/useBatchCalls';
import React from 'react';
import { useAccount } from 'wagmi';
import { CashIcon } from '@heroicons/react/outline';

const WithdrawInterface = new Interface(['function withdraw(address from, address to, uint216 amountPerSec)']);

interface ICall {
  [key: string]: string[];
}

export default function WithdrawAll() {
  const { data } = useStreamsAndHistory();
  const [{ data: accountData }] = useAccount();
  const { mutate: batchCall } = useBatchCalls();
  const { unsupported } = useNetworkProvider();

  const handleClick = () => {
    const calls: ICall =
      data.streams?.reduce((acc: ICall, current) => {
        if (accountData?.address.toLowerCase() === current.payerAddress.toLowerCase()) {
          const callData = acc[current.llamaContractAddress] ?? [];

          callData.push(
            WithdrawInterface.encodeFunctionData('withdraw', [
              current.payerAddress,
              current.payeeAddress,
              current.amountPerSec,
            ])
          );

          return (acc = { ...acc, [current.llamaContractAddress]: callData });
        }
        return acc;
      }, {}) ?? {};

    Object.keys(calls).map((p) => {
      batchCall({ llamaContractAddress: p, calls: calls[p] });
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!accountData || unsupported}
      className="flex w-full items-center justify-between gap-4 whitespace-nowrap"
    >
      <span>Send All</span>
      <CashIcon className="h-4 w-4" />
    </button>
  );
}
