import * as React from 'react';
import { IStream } from 'types';
import { formatBalance } from 'utils/amount';
import useWithdrawable from 'queries/useWithdrawable';
import Tooltip from 'components/Tooltip';
import { ExclamationCircleIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useIntl, useTranslations } from 'next-intl';

export const Withdrawable = ({ data }: { data: IStream }) => {
  const { data: callResult, isLoading } = useWithdrawable({
    contract: data.llamaTokenContract,
    payer: data.payerAddress,
    payee: data.payeeAddress,
    amountPerSec: data.amountPerSec,
    streamId: data.streamId,
  });

  const [balanceState, setBalanceState] = React.useState<number | null>(null);

  const intl = useIntl();

  const t = useTranslations('Streams');

  React.useEffect(() => {
    const id = setInterval(() => {
      setBalanceState(
        withdrawableAmtFormatter({
          amountPerSec: data.amountPerSec,
          decimals: data.token.decimals,
          withdrawableAmount: callResult?.withdrawableAmount,
          owed: callResult?.owed,
          lastUpdate: callResult?.lastUpdate,
        })
      );
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [callResult, data]);

  if (callResult?.owed > 0) {
    return (
      <p className="flex space-x-1">
        <span className="slashed-zero tabular-nums text-red-600">
          {balanceState && `${formatBalance(balanceState, intl)}`}
        </span>

        <Tooltip content={t('outOfFunds')}>
          <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
        </Tooltip>
      </p>
    );
  }

  if (isLoading) {
    return <div className="animate-shimmer h-4 w-full bg-gray-400"></div>;
  }

  if (data.paused) {
    return (
      <p className="flex space-x-1">
        {balanceState ? (
          <>
            <span className="slashed-zero tabular-nums">{`${formatBalance(balanceState, intl)}`}</span>
            <Tooltip content={t('paused')}>
              <ExclamationIcon className="h-5 w-5 text-yellow-600" />
            </Tooltip>
          </>
        ) : (
          <>
            <span className="slashed-zero tabular-nums text-yellow-600">{t('paused')}</span>
            <ExclamationIcon className="h-5 w-5 text-yellow-600" />
          </>
        )}
      </p>
    );
  }

  return (
    <p className="flex justify-start slashed-zero tabular-nums dark:text-white">
      {balanceState && formatBalance(balanceState, intl)}
    </p>
  );
};

interface IWithdrawableAmtFormatter {
  amountPerSec: string;
  decimals: number;
  withdrawableAmount?: number;
  owed: number;
  lastUpdate?: number;
}

function withdrawableAmtFormatter({
  amountPerSec,
  decimals,
  withdrawableAmount,
  owed,
  lastUpdate,
}: IWithdrawableAmtFormatter) {
  if (withdrawableAmount === undefined || lastUpdate === undefined) {
    return null;
  } else if (owed > 0) {
    return withdrawableAmount / 10 ** decimals;
  } else {
    return withdrawableAmount / 10 ** decimals + ((Date.now() / 1e3 - lastUpdate) * Number(amountPerSec)) / 1e20;
  }
}

// export function useWithdrawableAmtFormatter(data: IStream) {
//   const { data: callResult } = useWithdrawable({
//     contract: data.llamaTokenContract,
//     payer: data.payerAddress,
//     payee: data.payeeAddress,
//     amountPerSec: data.amountPerSec,
//     streamId: data.streamId,
//   });

//   return withdrawableAmtFormatter({
//     amountPerSec: data.amountPerSec,
//     decimals: data.token.decimals,
//     withdrawableAmount: callResult?.withdrawableAmount,
//     owed: callResult?.owed,
//     lastUpdate: callResult?.lastUpdate,
//   });
// }
