import useWithdrawable from 'queries/useWithdrawable';
import * as React from 'react';

interface WithdrawableProps {
  contract: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  decimals: number;
}

function formatBalance(balance: number) {
  return balance.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 });
}

export const Withdrawable = ({ contract, payer, payee, amtPerSec, decimals }: WithdrawableProps) => {
  const callResult = useWithdrawable(contract, payer, payee, amtPerSec).data;
  const [balanceState, setBalanceState] = React.useState<number>(0);

  const updateBalance = React.useCallback(() => {
    if (callResult?.withdrawableAmount === undefined || callResult.lastUpdate === undefined) return;
    if (callResult?.owed > 0) {
      setBalanceState(callResult?.withdrawableAmount / 10 ** decimals);
    } else {
      setBalanceState(
        callResult?.withdrawableAmount / 10 ** decimals +
          ((Date.now() / 1e3 - callResult.lastUpdate) * amtPerSec) / 1e20
      );
    }
  }, [callResult, amtPerSec, decimals]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 1);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return (
    <div className="flex items-baseline space-x-1">
      <p>{formatBalance(balanceState)}</p>
      <span className="text-xs text-gray-500 dark:text-gray-400">withdrawable</span>
      {callResult?.owed > 0 ? <p>Out of Funds</p> : ''}
    </div>
  );
};
