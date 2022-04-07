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

function formatAmtPerSec(amtPerSec: number) {
  const formatted = amtPerSec.toLocaleString('en-US', { maximumFractionDigits: 5 });
  if (formatted === '0') {
    return '0...';
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
  const amtPerSec = data.stream.amountPerSec / 1e20;
  const oldAmtPerSec = data.oldStream?.amountPerSec / 1e20;
  const token = data.stream.token.address;
  const streamCreatedTime = data.stream.createdTimestamp;
  const oldStreamCreatedTime = data.oldStream?.createdTimestamp;
  const oldPayee = data.oldStream?.payee.id;
  const oldPayer = data.oldStream?.payer.id;
  const createdTime = data.createdTimestamp;

  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <div className="flex flex-1 items-center space-x-2">
          {eventType === 'StreamModified' ? (
            <Tooltip content="Modified Stream">
              <div className="rounded bg-yellow-100 p-1 text-yellow-600">
                <PencilIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamCreated' ? (
            <Tooltip content="Incoming stream">
              <div className="rounded bg-green-100 p-1 text-green-600">
                <CheckIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamCancelled' ? (
            <Tooltip content="Cancelled stream">
              <div className="rounded bg-red-100 p-1 text-red-600">
                <XIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamModified' ? (
            <>
              {oldPayee !== undefined && oldPayer !== undefined ? (
                <>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === oldPayee ? formatAddress(oldPayer) : 'You'}
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === oldPayer ? formatAddress(oldPayee) : 'You'}
                  </span>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(oldAmtPerSec)}/sec</span>
                  <ChevronDoubleRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === payee ? formatAddress(payer) : 'You'}
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === payer ? formatAddress(payee) : 'You'}
                  </span>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}/sec</span>
                </>
              ) : (
                ''
              )}
            </>
          ) : (
            <>
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                {account === payee ? formatAddress(payer) : 'You'}
              </span>
              <ArrowRightIcon className="h-4 w-4" />
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                {account === payer ? formatAddress(payee) : 'You'}
              </span>
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}/sec</span>
            </>
          )}
        </div>
        <div className="flex justify-end">
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
            oldAmtPerSec={oldAmtPerSec}
            oldPayer={oldPayee}
            oldPayee={oldPayee}
            token={token}
            createdTime={createdTime}
            oldStreamCreatedTime={oldStreamCreatedTime}
            streamCreatedTime={streamCreatedTime}
          />
        </div>
      </div>
    </>
  );
};
