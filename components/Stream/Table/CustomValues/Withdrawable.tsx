import * as React from 'react';
import { IStream } from 'types';
import { formatBalance } from 'utils/amount';
import useWithdrawable from 'queries/useWithdrawable';
import { useTokenPrice } from 'queries/useTokenPrice';
import Tooltip from 'components/Tooltip';
import { ExclamationCircleIcon, ExclamationIcon } from '@heroicons/react/solid';
import { useLocale } from 'hooks';
import { useTranslations } from 'next-intl';

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

  const { locale } = useLocale();

  const t = useTranslations('Streams');

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
    return (
      <div className="flex space-x-1">
        <Tooltip content={balanceState && price && `${(balanceState * Number(price)).toFixed(2)} USD`}>
          <span className="slashed-zero tabular-nums text-red-600">
            {balanceState && `${formatBalance(balanceState, locale)}`}
          </span>
        </Tooltip>
        <Tooltip content={t('outOfFunds')}>
          <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
        </Tooltip>
      </div>
    );
  }

  if (data.paused) {
    return (
      <div className="flex space-x-1">
        {balanceState ? (
          <>
            <span className="slashed-zero tabular-nums">{`${formatBalance(balanceState, locale)}`}</span>
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
      </div>
    );
  }

  if (isLoading) {
    return <div className="animate-shimmer h-4 w-full bg-gray-400"></div>;
  }

  return (
    <div className="flex justify-start">
      <Tooltip content={balanceState && price && `${(balanceState * Number(price)).toFixed(2)} USD`}>
        <span className="slashed-zero tabular-nums">{balanceState && formatBalance(balanceState, locale)}</span>
      </Tooltip>
    </div>
  );
};
