import * as React from 'react';
import type { IStream } from '~/types';
import { formatBalance } from '~/utils/amount';
import useWithdrawable from '~/queries/useWithdrawable';
import Tooltip from '~/components/Tooltip';
import { ExclamationCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import { useIntl, useTranslations } from 'next-intl';

const Values = ({ data, callResult, isLoading }: { data: IStream; isLoading: boolean; callResult: any }) => {
  const intl = useIntl();

  const t = useTranslations('Streams');

  const outOfFundsref = React.useRef<HTMLSpanElement>(null);
  const pausedRef = React.useRef<HTMLSpanElement>(null);
  const withdrawableRef = React.useRef<HTMLParagraphElement>(null);

  React.useEffect(() => {
    const id = setInterval(() => {
      const balanceState = withdrawableAmtFormatter({
        amountPerSec: data.amountPerSec,
        decimals: data.token.decimals,
        withdrawableAmount: callResult?.withdrawableAmount,
        owed: callResult?.owed,
        lastUpdate: callResult?.lastUpdate,
      });

      if (balanceState) {
        if (outOfFundsref.current) {
          outOfFundsref.current.textContent = formatBalance(balanceState, intl);
        }
        if (pausedRef.current) {
          pausedRef.current.textContent = formatBalance(balanceState, intl);
        }
        if (withdrawableRef.current) {
          withdrawableRef.current.textContent = formatBalance(balanceState, intl);
        }
      } else {
        if (outOfFundsref.current) {
          outOfFundsref.current.textContent = '';
        }
        if (pausedRef.current) {
          pausedRef.current.textContent = '';
        }
        if (withdrawableRef.current) {
          withdrawableRef.current.textContent = '';
        }
      }
    }, 1);

    // clear interval when component unmounts
    return () => clearInterval(id);
  }, [callResult, data, intl]);

  if (callResult?.owed > 0) {
    return (
      <p className="flex space-x-1">
        <span className="slashed-zero tabular-nums text-red-600" ref={outOfFundsref}></span>
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
        <span className="slashed-zero tabular-nums" ref={pausedRef}></span>
        <Tooltip content={t('paused')}>
          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
        </Tooltip>
      </p>
    );
  }

  return <p className="flex justify-start slashed-zero tabular-nums dark:text-white" ref={withdrawableRef}></p>;
};

export const Withdrawable = ({ data }: { data: IStream }) => {
  const { data: callResult, isLoading } = useWithdrawable({
    contract: data.llamaTokenContract,
    payer: data.payerAddress,
    payee: data.payeeAddress,
    amountPerSec: data.amountPerSec,
    streamId: data.streamId,
  });

  return <Values data={data} callResult={callResult} isLoading={isLoading} />;
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
