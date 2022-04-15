import Tooltip from 'components/Tooltip';
import React from 'react';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';
import { networkDetails } from 'utils/constants';
import { useNetwork } from 'wagmi';

const StreamAddress = ({ data }: { data: IStream }) => {
  const [{ data: network }] = useNetwork();
  const [address, setAddress] = React.useState<string>('');
  const [link, setLink] = React.useState<string>('');

  React.useEffect(() => {
    if (data.streamType === 'incomingStream') {
      setAddress(data.payerAddress);
      setLink(`${networkDetails[Number(network.chain?.id)].blockExplorerURL}/address/${data.payerAddress}`);
    } else if (data.streamType === 'outgoingStream') {
      setAddress(data.payeeAddress);
      setLink(`${networkDetails[Number(network.chain?.id)].blockExplorerURL}/address/${data.payeeAddress}`);
    }
  }, [data, network]);

  return (
    <Tooltip content={`${address}`}>
      <a href={link} target="_blank" rel="noopener noreferrer">
        {formatAddress(address)}
      </a>
    </Tooltip>
  );
};

export default StreamAddress;
