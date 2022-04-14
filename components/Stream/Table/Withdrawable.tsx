import * as React from 'react';
import { IStream } from 'types';
import { formatBalance } from 'utils/amount';
import useWithdrawable from 'queries/useWithdrawable';
import { useTokenPrice } from 'queries/useTokenPrice';

const Withdrawable = ({ data }: { data: IStream }) => {
  const { data: callResult } = useWithdrawable({
    contract: data.llamaTokenContract,
    payer: data.payerAddress,
    payee: data.payeeAddress,
    amountPerSec: data.amountPerSec,
    streamId: data.streamId,
  });
  const [balanceState, setBalanceState] = React.useState<number | null>(null);
  const price = useTokenPrice(data.token.address.toLowerCase());

  React.useEffect(() => {
    const id = setInterval(() => {
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
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [callResult, data]);

  if (callResult?.owed > 0) {
    return <>Out of funds</>;
  }
  return (
    <div className="flex space-x-1">
      <span className="slashed-zero tabular-nums">{balanceState && formatBalance(balanceState)}</span>
      <span className="text-[10px] slashed-zero tabular-nums">
        {balanceState && (balanceState * Number(price.data)).toFixed(2)} USD
      </span>
    </div>
  );
};

export default Withdrawable;
