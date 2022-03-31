import * as React from 'react';
import { UserHistoryFragment } from 'services/generated/graphql';
import Tooltip from 'components/Tooltip';
import { formatAddress } from 'utils/address';
import { CheckIcon, XIcon, PencilIcon, ArrowRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useAccount } from 'wagmi';
import { MoreInfo } from './MoreInfo';
interface ItemProps {
  data: UserHistoryFragment;
}

interface HistoryProps {
  openInfo: boolean;
  setInfo: React.Dispatch<React.SetStateAction<boolean>>;
  account: string | undefined;
  eventType: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  oldPayee: string;
  oldAmtPerSec: number;
  createdTime: string;
}

function formatAmtPerSec(amtPerSec: number) {
  let formatted = amtPerSec.toString();
  if (formatted.length > 10) {
    return `${formatted.slice(0, 10)}...`;
  }
  return formatted;
}

export const ListItem = ({ data }: ItemProps) => {
  const [openInfo, setInfo] = React.useState(false);

  const [{ data: accountData }] = useAccount();
  const account = accountData?.address.toLowerCase();
  const eventType = data.eventType;
  const payer = data.stream.payer.id;
  const payee = data.stream.payee.id;
  const amtPerSec = data.stream.amountPerSec / 1e18;
  const oldAmtPerSec = data.oldStream?.amountPerSec / 1e18;
  let oldPayee = data.oldStream?.payee.id;
  if (oldPayee === undefined) {
    oldPayee = 'DNE';
  }
  const createdTime = new Date(data.createdTimestamp * 1000).toLocaleString('en-CA');

  switch (eventType) {
    case 'StreamCreated':
      return (
        <StreamCreated
          openInfo={openInfo}
          setInfo={setInfo}
          account={account}
          eventType={eventType}
          payer={payer}
          payee={payee}
          amtPerSec={amtPerSec}
          oldAmtPerSec={oldAmtPerSec}
          oldPayee={oldPayee}
          createdTime={createdTime}
        />
      );
    case 'StreamModified':
      return (
        <StreamModified
          openInfo={openInfo}
          setInfo={setInfo}
          account={account}
          eventType={eventType}
          payer={payer}
          payee={payee}
          amtPerSec={amtPerSec}
          oldAmtPerSec={oldAmtPerSec}
          oldPayee={oldPayee}
          createdTime={createdTime}
        />
      );

    case 'StreamCancelled':
      return (
        <StreamCancelled
          openInfo={openInfo}
          setInfo={setInfo}
          account={account}
          eventType={eventType}
          payer={payer}
          payee={payee}
          amtPerSec={amtPerSec}
          oldAmtPerSec={oldAmtPerSec}
          oldPayee={oldPayee}
          createdTime={createdTime}
        />
      );

    default:
      return <p> Failed to Load Data </p>;
  }
};

const StreamCreated = ({
  eventType,
  openInfo,
  setInfo,
  account,
  payer,
  payee,
  amtPerSec,
  createdTime,
}: HistoryProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Tooltip content="Incoming stream">
            <div className="rounded bg-green-100 p-1 text-green-600">
              <CheckIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === payee ? formatAddress(payer) : 'You'}
          </span>
          <ArrowRightIcon className="h-4 w-4" />
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === payer ? formatAddress(payee) : 'You'}
          </span>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}</span>
        </div>
        <div className="flex flex-1 justify-end ">
          <button onClick={() => setInfo(!openInfo)} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
            More Info
          </button>
          <MoreInfo
            isOpen={openInfo}
            setIsOpen={setInfo}
            eventType={eventType}
            payer={payer}
            payee={payee}
            amtPerSec={amtPerSec}
            oldAmtPerSec={null}
            oldPayee={null}
            createdTime={createdTime}
          />
        </div>
      </div>
    </>
  );
};

const StreamCancelled = ({
  eventType,
  openInfo,
  setInfo,
  account,
  payer,
  payee,
  amtPerSec,
  createdTime,
}: HistoryProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Tooltip content="Cancelled stream">
            <div className="rounded bg-red-100 p-1 text-red-600">
              <XIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === payee ? formatAddress(payer) : 'You'}
          </span>
          <ArrowRightIcon className="h-4 w-4" />
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === payer ? formatAddress(payee) : 'You'}
          </span>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}</span>
        </div>
        <div className="flex flex-1 justify-end ">
          <button onClick={() => setInfo(!openInfo)} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
            More Info
          </button>
          <MoreInfo
            isOpen={openInfo}
            setIsOpen={setInfo}
            eventType={eventType}
            payer={payer}
            payee={payee}
            amtPerSec={amtPerSec}
            oldAmtPerSec={null}
            oldPayee={null}
            createdTime={createdTime}
          />
        </div>
      </div>
    </>
  );
};

const StreamModified = ({
  openInfo,
  setInfo,
  account,
  eventType,
  payer,
  payee,
  amtPerSec,
  oldAmtPerSec,
  oldPayee,
  createdTime,
}: HistoryProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <div className="flex items-center space-x-2">
          <Tooltip content="Modified stream">
            <div className="rounded bg-yellow-100 p-1 text-yellow-600">
              <PencilIcon className="h-4 w-4" />
            </div>
          </Tooltip>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === oldPayee ? formatAddress(payer) : 'You'}
          </span>
          <ArrowRightIcon className="h-4 w-4" />
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
            {account === payer ? formatAddress(oldPayee) : 'You'}
          </span>
          <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(oldAmtPerSec)}</span>
          <ChevronDoubleRightIcon className="h-4 w-4" />
        </div>
        <div className="flex flex-1 justify-end ">
          <button onClick={() => setInfo(!openInfo)} className="rounded-lg bg-zinc-200 p-1 text-sm dark:bg-zinc-700">
            More Info
          </button>
          <MoreInfo
            eventType={eventType}
            isOpen={openInfo}
            setIsOpen={setInfo}
            payer={payer}
            payee={payee}
            amtPerSec={amtPerSec}
            oldAmtPerSec={oldAmtPerSec}
            oldPayee={oldPayee}
            createdTime={createdTime}
          />
        </div>
      </div>
      <div className="ml-8 flex items-center space-x-2">
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
          {account === payee ? formatAddress(payer) : 'You'}
        </span>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
          {account === payer ? formatAddress(payee) : 'You'}
        </span>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}</span>
      </div>
    </>
  );
};
