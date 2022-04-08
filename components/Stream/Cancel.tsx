import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import { useContract, useSigner } from 'wagmi';

interface CancelProps {
  contract: string;
  payee: string;
  amtPerSec: number;
}

export const Cancel = ({ contract, payee, amtPerSec }: CancelProps) => {
  const [{ data: signerData }] = useSigner();
  const call = useContract({
    addressOrName: contract,
    contractInterface: llamaContract,
    signerOrProvider: signerData,
  });

  const onCancel = React.useCallback(() => {
    async function cancelStream() {
      try {
        await call.cancelStream(payee, amtPerSec);
      } catch {}
    }
    cancelStream();
  }, [call, amtPerSec, payee]);

  return (
    <>
      <button onClick={onCancel} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
        Cancel
      </button>
    </>
  );
};
