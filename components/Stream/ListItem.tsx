import * as React from 'react';
import type { UserStreamFragment } from 'services/generated/graphql';
import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/solid';
import { formatAddress } from 'lib/address';

interface ItemProps {
  data: UserStreamFragment;
}

interface StreamProps {
  amount: number | null;
  address: string;
}

export const ListItem = ({ data }: ItemProps) => {
  // TODO cleanup address
  const isIncoming = data.payer?.id !== '0xfe5ee99fdbccfada674a3b85ef653b3ce4656e13';
  const [amount, setAmount] = React.useState<number | null>(null);

  const { createdAt, amountPerSec, isDataValid } = React.useMemo(() => {
    const createdAt = Number(data.createdTimestamp);
    const amountPerSec = Number(data.amountPerSec);
    const isDataValid = !Number.isNaN(createdAt) && !Number.isNaN(amountPerSec);
    return { createdAt, amountPerSec, isDataValid };
  }, [data]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isDataValid) {
        setAmount((Date.now() - createdAt) * amountPerSec);
      } else setAmount(null);
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, amountPerSec, isDataValid]);

  return (
    <li key={data.streamId} className="flex items-center space-x-2 break-words">
      {isIncoming ? (
        <IncomingStream amount={amount} address={data.payer.id} />
      ) : (
        <OutgoingStream amount={amount} address={data.payee.id} />
      )}
    </li>
  );
};

const IncomingStream = ({ amount, address }: StreamProps) => {
  return (
    <>
      <div className="rounded bg-green-100 p-1 text-green-600">
        <span className="sr-only">Incoming stream</span>
        <ArrowDownIcon className="h-4 w-4" />
      </div>
      <div className="flex-1">{formatAddress(address)}</div>
      <div>{amount}</div>
    </>
  );
};

const OutgoingStream = ({ amount, address }: StreamProps) => {
  return (
    <>
      <div className="rounded bg-red-100 p-1 text-red-600">
        <span className="sr-only">Outgoing stream</span>
        <ArrowUpIcon className="h-4 w-4" />
      </div>
      <div className="flex-1">{formatAddress(address)}</div>
      <div>{amount}</div>
    </>
  );
};
