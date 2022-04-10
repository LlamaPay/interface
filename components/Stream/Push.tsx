import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import { useContract, useSigner } from 'wagmi';

interface PushProps {
  buttonName: string;
  contract: string;
  payer: string;
  payee: string;
  amtPerSec: string;
}

export const Push = ({ buttonName, contract, payer, payee, amtPerSec }: PushProps) => {
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
      } catch (error) {}
    }
    doPush();
  }, [call, amtPerSec, payee, payer]);

  return (
    <>
      <button onClick={onPush} className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800">
        {buttonName}
      </button>
    </>
  );
};
