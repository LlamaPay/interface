import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';

interface MoreInfoProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  eventType: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  oldAmtPerSec: number;
  oldPayer: string | undefined;
  oldPayee: string | undefined;
  token: string;
  createdTime: string;
  oldStreamCreatedTime: string | undefined;
  streamCreatedTime: string;
}

function amountStreamed(createdTime: string, streamCreatedTime: string | undefined, amtPerSec: number) {
  const result = (Number(createdTime) - Number(streamCreatedTime)) * amtPerSec;
  return result;
}

export const MoreInfo = ({
  isOpen,
  setIsOpen,
  eventType,
  payer,
  payee,
  amtPerSec,
  oldAmtPerSec,
  oldPayer,
  oldPayee,
  token,
  createdTime,
  oldStreamCreatedTime,
  streamCreatedTime,
}: MoreInfoProps) => {
  return (
    <>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader title="More Info" setIsOpen={setIsOpen} />
        <div className="mt-3 flex flex-col space-y-2">
          <p className="text-md">{eventType}</p>
          <p className="text-sm">Token:</p>
          <span className=" text-sm">{token}</span>
          {eventType === 'StreamModified' ? (
            <div>
              <p className="text-sm">Old Payer:</p>
              <span className=" text-sm">{oldPayer}</span>
              <p className="text-sm">Old Payee:</p>
              <span className=" text-sm">{oldPayee}</span>
              <div className="flex space-x-1">
                <p className="text-sm">Old Amount Per Second:</p>
                <span className=" text-sm">{oldAmtPerSec}</span>
              </div>
              <div className="flex space-x-1">
                <p className="text-sm">Total Streamed:</p>
                <span className=" text-sm">
                  {amountStreamed(streamCreatedTime, oldStreamCreatedTime, oldAmtPerSec)}
                </span>
              </div>
            </div>
          ) : (
            ''
          )}
          <div>
            <p className="text-sm">Payer:</p>
            <span className=" text-sm">{payer}</span>
            <p className="text-sm">Payee:</p>
            <span className=" text-sm">{payee}</span>
            <div className="flex space-x-1">
              <p className="text-sm">Amount Per Second:</p>
              <span className=" text-sm">{amtPerSec}</span>
            </div>
            {eventType === 'StreamCancelled' ? (
              <div className="flex space-x-1">
                <p className="text-sm">Total Streamed:</p>
                <span className=" text-sm">{amountStreamed(createdTime, streamCreatedTime, amtPerSec)}</span>
              </div>
            ) : (
              ''
            )}
          </div>
          <div className="flex space-x-1">
            <p className="text-sm">Timestamp:</p>
            <span className=" text-sm">{new Date(Number(createdTime) * 1000).toLocaleString('en-CA')}</span>
          </div>
        </div>
      </DialogWrapper>
    </>
  );
};
