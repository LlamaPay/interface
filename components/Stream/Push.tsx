import * as React from 'react';

interface PushProps {
  contract: any;
  payer: string;
  payee: string;
  amtPerSec: number;
}

export const Push = ({ contract, payer, payee, amtPerSec }: PushProps) => {
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
        Send
      </button>
    </>
  );
};
