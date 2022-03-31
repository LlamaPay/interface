import * as React from 'react';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';

interface PushProps {
  contractAddress: string;
  payer: string;
  payee: string;
  amtPerSec: number;
}

export const Push = ({ contractAddress, payer, payee, amtPerSec }: PushProps) => {
  const [{ data: signerData }] = useSigner();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamapayABI,
    signerOrProvider: signerData,
  });

  const onPush = React.useCallback(() => {
    async function doPush() {
      try {
        await contract.withdraw(payer, payee, amtPerSec);
      } catch {}
    }
    doPush();
  }, [contract]);

  return (
    <>
      <button onClick={onPush} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
        Push
      </button>
    </>
  );
};
