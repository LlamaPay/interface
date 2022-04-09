import * as React from 'react';
import useWithdrawable from 'queries/useWithdrawable';
import { IStream } from 'types';

interface WithdrawableProps {
  data: IStream;
}

function formatBalance(balance: number) {
  return balance.toLocaleString('en-US', { maximumFractionDigits: 5, minimumFractionDigits: 5 });
}

export const Withdrawable = ({ data }: WithdrawableProps) => {
  const { data: callResult } = useWithdrawable({
    contract: data.llamaTokenContract,
    payer: data.payerAddress,
    payee: data.payeeAddress,
    amountPerSec: Number(data.amountPerSec),
    streamId: data.streamId,
  });
  const [balanceState, setBalanceState] = React.useState<number>(0);

  const updateBalance = React.useCallback(() => {
    if (callResult?.withdrawableAmount === undefined || callResult.lastUpdate === undefined) return;
    if (callResult?.owed > 0) {
      setBalanceState(callResult?.withdrawableAmount / 10 ** data.token.decimals);
    } else {
      setBalanceState(
        callResult?.withdrawableAmount / 10 ** data.token.decimals +
          ((Date.now() / 1e3 - callResult.lastUpdate) * Number(data.amountPerSec)) / 1e20
      );
    }
  }, [callResult, data]);

  React.useEffect(() => {
    updateBalance();
    const interval = setInterval(() => {
      updateBalance();
    }, 100);
    return () => clearInterval(interval);
  }, [updateBalance]);

  return (
    <div className="flex items-baseline space-x-1">
      <p className="tabular-nums">{balanceState && formatBalance(balanceState)}</p>
      <span className="text-xs text-gray-500 dark:text-gray-400">withdrawable</span>
      {callResult?.owed > 0 ? <p>Out of Funds</p> : ''}
    </div>
  );
};
