import { Interface } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import useStreamsAndHistory from 'queries/useStreamsAndHistory';
import useWithdrawAll from 'queries/useWithdrawAll';
import React from 'react';
import { useAccount } from 'wagmi';

export default function WithdrawAll() {
  const { data } = useStreamsAndHistory();
  const [{ data: accountData }] = useAccount();
  const { mutate: withdrawAll } = useWithdrawAll();
  const { unsupported } = useNetworkProvider();

  const handleClick = React.useCallback(() => {
    const iface = new Interface(['function withdraw(address from, address to, uint216 amountPerSec)']);
    const calls: { [key: string]: string[] } = {};
    data.streams?.map((p) => {
      if (accountData?.address.toLowerCase() === p.payerAddress.toLowerCase()) {
        const arr = calls[p.llamaContractAddress] ?? [];
        arr.push(iface.encodeFunctionData('withdraw', [p.payerAddress, p.payeeAddress, p.amountPerSec]));
        calls[p.llamaContractAddress] = arr;
      }
    });
    Object.keys(calls).map((p) => {
      withdrawAll({ llamaContractAddress: p, calldata: calls[p] });
    });
  }, [data, accountData, withdrawAll]);

  return (
    <>
      <button
        onClick={handleClick}
        className="secondary-button disabled:cursor-not-allowed"
        disabled={!unsupported ? false : true}
      >
        Send all
      </button>
    </>
  );
}
