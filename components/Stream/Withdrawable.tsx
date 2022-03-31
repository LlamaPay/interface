import BigNumber from 'bignumber.js';
import * as React from 'react';
import { llamapayABI } from 'utils/contract';
import { useContract, useSigner } from 'wagmi';

interface WithdrawableProps {
  contractAddress: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  decimals: number;
}

export const Withdrawable = ({ contractAddress, payer, payee, amtPerSec, decimals }: WithdrawableProps) => {
  const [{ data: signerData }] = useSigner();

  const [balanceState, setBalanceState] = React.useState<string>();

  const contract = useContract({
    addressOrName: contractAddress,
    contractInterface: llamapayABI,
    signerOrProvider: signerData,
  });

  React.useEffect(() => {
    async function getBalance() {
      try {
        const call = await contract.withdrawable(payer, payee, amtPerSec);
        const balance = new BigNumber(call.withdrawableAmount.toString()).div(10 ** decimals).toString();
        setBalanceState(balance);
      } catch (error) {}
    }
    getBalance();
    const interval = setInterval(() => {
      getBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [contract]);

  return (
    <div className="flex items-baseline space-x-1">
      <p>{balanceState}</p>
      <span className="text-xs text-gray-500 dark:text-gray-400">withdrawable</span>
    </div>
  );
};
