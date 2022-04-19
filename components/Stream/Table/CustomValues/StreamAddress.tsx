import Tooltip from 'components/Tooltip';
import React from 'react';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import { useChainExplorer } from 'hooks';

export const StreamAddress = ({ data }: { data: IStream }) => {
  const { url: chainExplorer } = useChainExplorer();
  const address = React.useMemo(() => {
    if (data.streamType === 'incomingStream') {
      return data.payerAddress;
    } else if (data.streamType === 'outgoingStream') {
      return data.payeeAddress;
    }
  }, [data]);

  return (
    <Tooltip content={`${address}`}>
      <a href={`${chainExplorer}/address/${address}`} target="_blank" rel="noopener noreferrer">
        {address ? formatAddress(address) : ''}
      </a>
    </Tooltip>
  );
};
