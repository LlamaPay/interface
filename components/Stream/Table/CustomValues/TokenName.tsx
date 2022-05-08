import * as React from 'react';
import { useChainExplorer } from 'hooks';
import Image from 'next/image';
import defaultImage from 'public/empty-token.webp';
import useTokenList from 'hooks/useTokenList';
import { IStream } from 'types';
import { useTranslations } from 'next-intl';

export function TokenName({ data }: { data: IStream }) {
  // function that returns chain explorer url based on the chain user is connected to
  const { url: chainExplorer } = useChainExplorer();

  const { data: tokens } = useTokenList();

  const token = React.useMemo(() => {
    return tokens ? tokens.find((t) => t.tokenAddress.toLowerCase() === data.token.address.toLowerCase()) : null;
  }, [tokens, data]);

  const t = useTranslations('Common');

  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 flex-shrink-0 items-center rounded-full">
        <Image
          src={token?.logoURI ?? defaultImage}
          alt={t('logoAlt', { name: data.tokenName })}
          width="18px"
          height="18px"
        />
      </div>
      {chainExplorer ? (
        <a
          href={`${chainExplorer}/address/${data.token.address}`}
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
