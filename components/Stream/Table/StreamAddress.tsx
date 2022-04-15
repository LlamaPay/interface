import Tooltip from 'components/Tooltip';
import React from 'react';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

const StreamAddress = ({ data }: { data: IStream }) => {
  const [{ data: network }] = useNetwork();

  const address = React.useMemo(() => {
    if (data.streamType === 'incomingStream') {
      return data.payerAddress;
    } else if (data.streamType === 'outgoingStream') {
      return data.payeeAddress;
    }
  }, [data]);

  return (
    <Tooltip content={`${address}`}>
      <a
        href={`${networkDetails[Number(network.chain?.id)].blockExplorerURL}/address/${address}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {address ? formatAddress(address) : ''}
      </a>
    </Tooltip>
  );
};

export default StreamAddress;
