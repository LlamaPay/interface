import * as React from 'react';

interface CancelProps {
  contract: any;
  payee: string;
  amtPerSec: number;
}

export const Cancel = ({ contract, payee, amtPerSec }: CancelProps) => {
  const onCancel = React.useCallback(() => {
    async function cancelStream() {
      try {
        await contract.cancelStream(payee, amtPerSec);
      } catch {}
    }
    cancelStream();
  }, [contract, amtPerSec, payee]);

  return (
    <>
      <button onClick={onCancel} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
        Cancel
      </button>
    </>
  );
};
