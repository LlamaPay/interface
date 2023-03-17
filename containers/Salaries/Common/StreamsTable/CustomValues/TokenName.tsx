import * as React from 'react';
import { useChainExplorer, useTokenList } from '~/hooks';
import Image from 'next/image';
import defaultImage from '~/public/empty-token.webp';
import type { IStream } from '~/types';
import { useTranslations } from 'next-intl';

export function TokenName({ data }: { data: IStream }) {
  // function that returns chain explorer url based on the chain user is connected to
  const { url: chainExplorer, id } = useChainExplorer();

  const { data: tokens } = useTokenList();

  const token = React.useMemo(() => {
    return tokens ? tokens.find((t) => t.tokenAddress.toLowerCase() === data.token.address.toLowerCase()) : null;
  }, [tokens, data]);

  const t = useTranslations('Common');

  return (
    <div className="flex items-center gap-2">
      <span className="h-[18px] w-[18px] rounded-full">
        <Image
          src={token?.logoURI ?? defaultImage}
          alt={t('logoAlt', { name: data.tokenName })}
          width={18}
          height={18}
        />
      </span>
      {chainExplorer ? (
        <a
          href={
            id === 82 || id === 1088
              ? `${chainExplorer}address/${data.token.address}`
              : `${chainExplorer}/address/${data.token.address}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="dark:text-white"
        >
          {data.tokenSymbol}
        </a>
      ) : (
        <span>{data.tokenSymbol}</span>
      )}
    </div>
  );
}
