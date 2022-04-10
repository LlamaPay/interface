import * as React from 'react';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import { formatAddress } from 'utils/address';
import Tooltip from 'components/Tooltip';
import { useAccount } from 'wagmi';
import { Modify } from '.';
import { useDialogState } from 'ariakit';
import { IStream } from 'types';
import { useAddressStore } from 'store/address';
import { Withdrawable } from './Withdrawable';
import { Push } from './Push';
import { Cancel } from './Cancel';

interface ItemProps {
  data: IStream;
}

interface StreamProps {
  totalStreamed: string | null;
  address: string;
  ticker?: string;
}

export const ListItem = ({ data }: ItemProps) => {
  const [{ data: accountData }] = useAccount();

  const modifyDialog = useDialogState();

  // check the stream type (incoming or outgoing)
  const isIncoming = data.payerAddress !== accountData?.address.toLowerCase();

  const [totalStreamed, setTotalStreamed] = React.useState<string | null>(null);

  // get address from localstorage if its saved by any other name, else use payeeAddress
  const savedAddressName =
    useAddressStore((state) => state.payeeAddresses.find((p) => p.id === data.payeeAddress))?.shortName ??
    data.payeeAddress;

  // console.log(s);

  // format createdAt timestamp and amountPerSec and check if they are valid numbers
  const { createdAt, amountPerSec, isDataValid } = React.useMemo(() => {
    const createdAt = Number(data.createdTimestamp) * 1000;
    const amountPerSec = Number(data.amountPerSec);
    const isDataValid = !Number.isNaN(createdAt) && !Number.isNaN(amountPerSec);
    return { createdAt, amountPerSec, isDataValid };
  }, [data]);

  // function that sets updated totalStreamed amount
  const updateStreamed = React.useCallback(() => {
    if (isDataValid) {
      const totalAmount = (((Date.now() - createdAt) / 1000) * amountPerSec) / 1e20;
      setTotalStreamed(
        totalAmount.toLocaleString('en-US', {
          maximumFractionDigits: 5,
          minimumFractionDigits: 5,
        })
      );
    } else setTotalStreamed(null);
  }, [amountPerSec, createdAt, isDataValid]);

  React.useEffect(() => {
    // update streamed amount on initial render and on every other second
    updateStreamed();
    const interval = setInterval(() => {
      updateStreamed();
    }, 100);
    return () => clearInterval(interval);
  }, [updateStreamed]);

  return (
    <li key={data.streamId} className="flex flex-col space-y-2 space-x-1 sm:flex-row  sm:items-center sm:space-y-0">
      {isIncoming ? (
        <>
          <IncomingStream totalStreamed={totalStreamed} address={data.payerAddress} ticker={data.token.name} />
          <Withdrawable data={data} />
          <Push
            buttonName="Withdraw"
            contract={data.llamaContractAddress}
            payer={data.payerAddress}
            payee={data.payeeAddress}
            amtPerSec={data.amountPerSec}
          />
        </>
      ) : (
        <>
          <OutgoingStream totalStreamed={totalStreamed} address={savedAddressName} ticker={data.token.name} />
          <Withdrawable data={data} />
          <Push
            buttonName="Send"
            contract={data.llamaContractAddress}
            payer={data.payerAddress}
            payee={data.payeeAddress}
            amtPerSec={data.amountPerSec}
          />
          <button className="rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800" onClick={modifyDialog.toggle}>
            Modify
          </button>
          <Cancel data={data} />
          <Modify data={data} title="Modify" dialog={modifyDialog} savedAddressName={savedAddressName} />
        </>
      )}
    </li>
  );
};

const IncomingStream = ({ totalStreamed, address, ticker = 'Unknown token' }: StreamProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Incoming stream">
          <div className="rounded bg-green-100 p-1 text-green-600">
            <span className="sr-only">Incoming stream from</span>
            <ArrowDownIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">{formatAddress(address)}</span>
      </div>

      {totalStreamed && (
        <div className="flex items-baseline space-x-1 slashed-zero tabular-nums">
          <Tooltip content={ticker}>
            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-400"></div>
          </Tooltip>
          {/* TODO handle internalization and decimals when totalStreamed is not USD */}
          <span>{`+${totalStreamed}`}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">so far</span>
          <span>
            <svg
              stroke="currentColor"
              fill="rgb(22 163 74)"
              strokeWidth="0"
              viewBox="0 0 12 16"
              height="10px"
              width="10px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M12 11L6 5l-6 6h12z"></path>
            </svg>
          </span>
        </div>
      )}
    </>
  );
};

const OutgoingStream = ({ totalStreamed, address, ticker = 'Unknown token' }: StreamProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2 truncate">
        <Tooltip content="Outgoing stream">
          <div className="rounded bg-red-100 p-1 text-red-600">
            <span className="sr-only">Outgoing stream to</span>
            <ArrowUpIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate">{address}</span>
      </div>
      {totalStreamed && (
        <div className="flex items-center space-x-1 slashed-zero tabular-nums">
          <Tooltip content={ticker}>
            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-400"></div>
          </Tooltip>
          {/* TODO handle internalization and decimals when totalStreamed is not USD */}
          <span>{`-${totalStreamed}`}</span>
          <span className="items-baseline text-xs text-gray-500 dark:text-gray-400">so far</span>
          <span>
            <svg
              stroke="currentColor"
              fill="rgb(220 38 38)"
              strokeWidth="0"
              viewBox="0 0 12 16"
              height="10px"
              width="10px"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M0 5l6 6 6-6H0z"></path>
            </svg>
          </span>
        </div>
      )}
    </>
  );
};
