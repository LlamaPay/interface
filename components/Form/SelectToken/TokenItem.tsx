import * as React from 'react';
import classNames from 'classnames';
import useTokenBalances from 'queries/useTokenBalances';
import Image from 'next/image';
import defaultImage from 'public/empty-token.webp';
import { useTranslations } from 'next-intl';

export function TokenItem({
  value,
  shortName,
  showBalance,
}: {
  value: string;
  shortName?: boolean;
  showBalance?: boolean;
}) {
  const { data: tokens } = useTokenBalances();

  const data = React.useMemo(() => {
    return tokens ? tokens.find((t) => t.tokenAddress === value) : null;
  }, [value, tokens]);

  const t = useTranslations('Common');

  return (
    <div
      className={classNames(
        'flex flex-1 flex-row items-center justify-between',
        shortName ? 'truncate py-[5px]' : 'balance-wrap p-2'
      )}
      id="token-render-value"
    >
      <div className="flex items-center space-x-2 overflow-x-hidden">
        <div className="flex h-7 w-7 flex-shrink-0 items-center rounded-full">
          {data ? (
            <Image src={data.logoURI} alt={t('logoAlt', { name: data.name })} width="24px" height="24px" />
          ) : (
            <Image src={defaultImage} width="24px" height="24px" alt={t('logoAlt', { name: 'fallback token' })} />
          )}
        </div>
        {data ? (
          <div className="truncate">{shortName ? data.symbol : data.name}</div>
        ) : (
          <div className="truncate">{value}</div>
        )}
      </div>
      {showBalance && (
        <div className="ml-4 whitespace-nowrap slashed-zero text-gray-600 dark:text-gray-400">
          {data?.balance && `${data.balance} ${data?.symbol}`}
        </div>
      )}
    </div>
  );
}
