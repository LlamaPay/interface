import BigNumber from 'bignumber.js';
import * as React from 'react';

interface WithdrawableProps {
  contract: any;
  payer: string;
  payee: string;
  amtPerSec: number;
  decimals: number;
}

function formatBalance(balance: number, decimals: number) {
  const formatted = balance / 10 ** decimals;

  return formatted.toLocaleString('en-US', { maximumFractionDigits: 4 });
}

export const Withdrawable = ({ contract, payer, payee, amtPerSec, decimals }: WithdrawableProps) => {
  const [balanceState, setBalanceState] = React.useState<number>(0);
  const [calledBalance, setCalledBalance] = React.useState<number>();
  const [calledLastUpdate, setCalledLastUpdate] = React.useState<number>();

  const callBalance = React.useCallback(() => {
    async function callContract() {
      try {
        const call = await contract.withdrawable(payer, payee, amtPerSec);
        setCalledBalance(Number(call.withdrawableAmount));
        setCalledLastUpdate(Number(call.lastUpdate));
      } catch (error) {
        setTimeout(() => {
          callContract();
        }, 1000);
      }
    }
    callContract();
  }, [contract]);

  callBalance();
  const updateBalance = React.useCallback(() => {
    if (calledBalance === undefined || calledLastUpdate === undefined) return;
    const realBalance = new BigNumber(calledBalance)
      .div(10 ** decimals)
      .plus(((Date.now() / 1e3 - calledLastUpdate) * amtPerSec) / 1e20);
    setBalanceState(Number(realBalance));
  }, [calledBalance, amtPerSec, calledLastUpdate, decimals]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1000);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return (
    <div className="flex items-baseline space-x-1">
      <p>{formatBalance(balanceState, decimals)}</p>
      <span className="text-xs text-gray-500 dark:text-gray-400">withdrawable</span>
    </div>
  );
};
