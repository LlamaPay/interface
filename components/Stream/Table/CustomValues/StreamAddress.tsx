import * as React from 'react';
import Tooltip from 'components/Tooltip';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import { useChainExplorer } from 'hooks';

export const StreamAddress = ({ data }: { data: IStream }) => {
  const { url: chainExplorer, id } = useChainExplorer();

  const address = React.useMemo(() => {
    if (data.streamType === 'incomingStream') {
      return data.payerAddress;
    } else if (data.streamType === 'outgoingStream') {
      return data.payeeAddress;
    }
  }, [data]);

  const ens = React.useMemo(() => {
    if (data.streamType === 'incomingStream') {
      return data.payerEns;
    } else if (data.streamType === 'outgoingStream') {
      return data.payeeEns;
    }
  }, [data]);

  return (
    <Tooltip content={`${address}`}>
      <a
        href={id === 82 ? `${chainExplorer}address/${address}` : `${chainExplorer}/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="dark:text-white"
      >
        {ens ? ens : address ? formatAddress(address) : ''}
      </a>
    </Tooltip>
  );
};
