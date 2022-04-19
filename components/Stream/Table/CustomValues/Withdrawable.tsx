import * as React from 'react';
import { IStream } from 'types';
import { formatBalance } from 'utils/amount';
import useWithdrawable from 'queries/useWithdrawable';
import { useTokenPrice } from 'queries/useTokenPrice';
import Tooltip from 'components/Tooltip';

export const Withdrawable = ({ data }: { data: IStream }) => {
  const { data: callResult, isLoading } = useWithdrawable({
    contract: data.llamaTokenContract,
    payer: data.payerAddress,
    payee: data.payeeAddress,
    amountPerSec: data.amountPerSec,
    streamId: data.streamId,
  });
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const { data: price } = useTokenPrice(data.token.address.toLowerCase());

  const setWithdrawables = React.useCallback(() => {
    if (callResult?.withdrawableAmount === undefined || callResult.lastUpdate === undefined) {
      setBalanceState(null);
    } else if (callResult?.owed > 0) {
      setBalanceState(callResult?.withdrawableAmount / 10 ** data.token.decimals);
    } else {
      setBalanceState(
        callResult?.withdrawableAmount / 10 ** data.token.decimals +
          ((Date.now() / 1e3 - callResult.lastUpdate) * Number(data.amountPerSec)) / 1e20
      );
    }
  }, [callResult, data]);

  React.useEffect(() => {
    const id = setInterval(setWithdrawables, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [setWithdrawables]);

  if (callResult?.owed > 0) {
    return <>Out of funds</>;
  }

  if (isLoading) {
    return <div className="animate-shimmer h-4 w-full bg-gray-400"></div>;
  }

  return (
    <div className="flex justify-start">
      <Tooltip content={balanceState && price && `${(balanceState * Number(price)).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">{balanceState && formatBalance(balanceState)}</span>
      </Tooltip>
    </div>
  );
};
