import llamaContract from 'abis/llamaContract';
import * as React from 'react';
import { IStream } from 'types';
import { useContract, useSigner } from 'wagmi';

interface CancelProps {
  data: IStream;
}

export const Cancel = ({ data }: CancelProps) => {
  const [{ data: signerData }] = useSigner();
  const call = useContract({
    addressOrName: data.llamaContractAddress,
    contractInterface: llamaContract,
    signerOrProvider: signerData,
  });

  const onCancel = React.useCallback(() => {
    async function cancelStream() {
      try {
        await call.cancelStream(data.payeeAddress, data.amountPerSec);
      } catch {}
    }
    cancelStream();
  }, [call, data]);

  return (
    <>
      <button onClick={onCancel} className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800">
        Cancel
      </button>
    </>
  );
};
