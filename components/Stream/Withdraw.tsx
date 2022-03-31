import * as React from 'react';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';

interface WithdrawProps {
  contractAddress: string;
  payer: string;
  payee: string;
  amtPerSec: number;
}

export const Withdraw = ({ contractAddress, payer, payee, amtPerSec }: WithdrawProps) => {
  const [{ data: signerData }] = useSigner();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamapayABI,
    signerOrProvider: signerData,
  });

  const onWithdraw = React.useCallback(() => {
    async function withdraw() {
      try {
        await contract.withdraw(payer, payee, amtPerSec);
      } catch {}
    }
    withdraw();
  }, [contract]);

  return (
    <>
      <button onClick={onWithdraw} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
        Withdraw
      </button>
    </>
  );
};
