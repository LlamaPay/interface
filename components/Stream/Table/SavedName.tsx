import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import Tooltip from 'components/Tooltip';
import { useAddressStore } from 'store/address';
import { IStream } from 'types';
import { formatAddress } from 'utils/address';

export default function SavedName({ data }: { data: IStream }) {
  // check the stream type (incoming or outgoing)
  const isIncoming = data.streamType === 'incomingStream';

  const address = isIncoming ? data.payerAddress : data.payeeAddress;

  const name =
    useAddressStore((state) => state.payeeAddresses.find((p) => p.id === address))?.shortName ?? formatAddress(address);

  return (
    <div className="flex items-center space-x-2 truncate">
      {isIncoming ? (
        <>
          <Tooltip content="Incoming stream">
            <div className="rounded bg-green-100 p-1 text-green-600">
              <span className="sr-only">Incoming stream from</span>
              <ArrowDownIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>{name}</span>
        </>
      ) : (
        <>
          <Tooltip content="Outgoing stream">
            <div className="rounded bg-red-100 p-1 text-red-600">
              <span className="sr-only">Outgoing stream to</span>
              <ArrowUpIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span>{name}</span>
        </>
      )}
    </div>
  );
}
