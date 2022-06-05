import Tooltip from 'components/Tooltip';
import { useChainExplorer } from 'hooks';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useAddressStore } from 'store/address';
import { formatAddress } from 'utils/address';

export function SavedName({ value, eventType, ens }: { value: string; eventType: string; ens: string | null }) {
  const t = useTranslations('Common');

  const you = eventType === 'Deposit' || eventType === 'PayerWithdraw' ? t('you') : false;

  const name =
    useAddressStore((state) => state.addressBook.find((p) => p.id?.toLowerCase() === value?.toLowerCase()))
      ?.shortName ??
    ens ??
    formatAddress(value);

  const { url: chainExplorer } = useChainExplorer();

  return (
    <Tooltip content={value}>
      <a
        href={`${chainExplorer}/address/${value}`}
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-white"
      >
        {you || name}
      </a>
    </Tooltip>
  );
}
