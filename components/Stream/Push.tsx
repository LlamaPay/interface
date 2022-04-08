import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import { useContract, useSigner } from 'wagmi';

interface PushProps {
  contract: string;
  payer: string;
  payee: string;
  amtPerSec: number;
}

export const Push = ({ contract, payer, payee, amtPerSec }: PushProps) => {
  const [{ data: signerData }] = useSigner();
  const call = useContract({
    addressOrName: contract,
    contractInterface: llamaContract,
    signerOrProvider: signerData,
  });

  const onPush = React.useCallback(() => {
    async function doPush() {
      try {
        await call.withdraw(payer, payee, amtPerSec);
      } catch {}
    }
    doPush();
  }, [call, amtPerSec, payee, payer]);

  return (
    <>
      <button onClick={onPush} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
        Send
      </button>
    </>
  );
};
