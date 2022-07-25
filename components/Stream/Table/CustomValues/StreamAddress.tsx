import * as React from 'react';
import Tooltip from 'components/Tooltip';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import { useChainExplorer } from 'hooks';

interface IStreamAddressProps {
  valueToSort: string;
  valueToShow: string;
  address: string;
}

export const StreamAddress = ({ data }: { data: IStreamAddressProps }) => {
  const { url: chainExplorer, id } = useChainExplorer();

  return (
    <Tooltip content={data.address}>
      <a
        href={
          id === 82 || id === 1088
            ? `${chainExplorer}address/${data.address}`
            : `${chainExplorer}/address/${data.address}`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-white"
      >
        {data.valueToShow}
      </a>
    </Tooltip>
  );
};

export function streamAddressFormatter(data: IStream): IStreamAddressProps {
  if (data.streamType === 'incomingStream') {
    return {
      valueToSort: data.payerEns || data.payerAddress,
      valueToShow: data.payerEns || formatAddress(data.payerAddress),
      address: data.payerAddress,
    };
  } else if (data.streamType === 'outgoingStream') {
    return {
      valueToSort: data.payeeEns || data.payeeAddress,
      valueToShow: data.payeeEns || formatAddress(data.payeeAddress),
      address: data.payeeAddress,
    };
  } else return { valueToSort: '', valueToShow: '', address: '' };
}
