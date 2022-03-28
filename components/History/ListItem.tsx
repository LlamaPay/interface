import { UserHistoryFragment } from "services/generated/graphql";
import Tooltip from 'components/Tooltip';
import { formatAddress } from 'utils/address';
import { CheckIcon, XIcon, PencilIcon, ArrowRightIcon, ChevronDoubleRightIcon } from "@heroicons/react/solid"
interface ItemProps {
  data: UserHistoryFragment
}

interface HistoryProps {
  payer: string;
  payee: string;
  amtPerSec: number;
  oldPayee: string;
  oldAmtPerSec: number;
  createdTime: string;
}

export const ListItem = ({ data }: ItemProps) => {
  const eventType = data.eventType;
  const payer = data.stream.payer.id;
  const payee = data.stream.payee.id;
  const amtPerSec = data.stream.amountPerSec / 1e18;
  const oldAmtPerSec = data.oldStream?.amountPerSec / 1e18;
  let oldPayee = data.oldStream?.payee.id
  if (oldPayee === undefined) {
    oldPayee = "DNE";
  }
  const createdTime = (new Date(data.createdTimestamp * 1000)).toLocaleString("en-CA");

  switch (eventType) {
    case "StreamCreated":
      return (
        <StreamCreated payer={payer} payee={payee} amtPerSec={amtPerSec} oldAmtPerSec={oldAmtPerSec} oldPayee={oldPayee} createdTime={createdTime} />
      )
    case "StreamModified":
      return (
        <StreamCancelled payer={payer} payee={payee} amtPerSec={amtPerSec} oldAmtPerSec={oldAmtPerSec} oldPayee={oldPayee} createdTime={createdTime} />
      )

    case "StreamCancelled":
      return (
        <StreamModified payer={payer} payee={payee} amtPerSec={amtPerSec} oldAmtPerSec={oldAmtPerSec} oldPayee={oldPayee} createdTime={createdTime} />
      )

    default:
      return (
        <p> Failed to Load Data </p>
      )
  }
};

const StreamCreated = ({ payer, payee, amtPerSec, createdTime }: HistoryProps) => {

  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Incoming stream">
          <div className="rounded bg-green-100 p-1 text-green-600">
            <CheckIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payer)}</span>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payee)}</span>
        <span> {amtPerSec}</span>
        <span>{createdTime}</span>
      </div>
    </>
  )
}

const StreamCancelled = ({ payer, payee, amtPerSec, createdTime }: HistoryProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Cancelled stream">
          <div className="rounded bg-red-100 p-1 text-red-600">
            <XIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payer)}</span>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payee)}</span>
        <span> {amtPerSec}</span>
        <span>{createdTime}</span>
      </div>
    </>
  )
}

const StreamModified = ({ payer, payee, amtPerSec, oldAmtPerSec, oldPayee, createdTime }: HistoryProps) => {
  return (
    <>
      <div className="mr-2 flex flex-1 items-center space-x-2">
        <Tooltip content="Modified stream">
          <div className="rounded bg-yellow-100 p-1 text-yellow-600">
            <PencilIcon className="h-4 w-4" />
          </div>
        </Tooltip>
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payer)}</span>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(oldPayee)}</span>
        <span> {oldAmtPerSec}</span>
        <ChevronDoubleRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payer)}</span>
        <ArrowRightIcon className="h-4 w-4" />
        <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAddress(payee)}</span>
        <span> {amtPerSec}</span>
        <span>{createdTime}</span>
      </div>
    </>
  )
}
