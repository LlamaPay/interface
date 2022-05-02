import Tooltip from 'components/Tooltip';
import { useChainExplorer } from 'hooks';
import * as React from 'react';
import { useAddressStore } from 'store/address';
import { formatAddress } from 'utils/address';

export function SavedName({ value }: { value: string }) {
  const name =
    useAddressStore((state) => state.addressBook.find((p) => p.id?.toLowerCase() === value?.toLowerCase()))
      ?.shortName ?? formatAddress(value);

  const { url: chainExplorer } = useChainExplorer();

  return (
    <Tooltip content={value}>
      <a href={`${chainExplorer}/address/${value}`} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    </Tooltip>
  );
}
