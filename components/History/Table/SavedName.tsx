import Tooltip from 'components/Tooltip';
import * as React from 'react';
import { useAddressStore } from 'store/address';
import { formatAddress } from 'utils/address';

export function SavedName({ value }: { value: string }) {
  const name =
    useAddressStore((state) => state.addressBook.find((p) => p.id?.toLowerCase() === value?.toLowerCase()))
      ?.shortName ?? formatAddress(value);

  return <Tooltip content={value}>{name}</Tooltip>;
}
