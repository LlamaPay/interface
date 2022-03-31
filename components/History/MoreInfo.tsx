import { ArrowRightIcon } from '@heroicons/react/solid';
import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';

interface MoreInfoProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  eventType: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  oldAmtPerSec: number;
  oldPayer: string;
  oldPayee: string;
  createdTime: string;
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
  createdTime,
}: MoreInfoProps) => {
  return (
    <>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader title="More Info" setIsOpen={setIsOpen} />
        <div className="mt-3 flex flex-col space-y-2">
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
          </div>
        </div>
      </DialogWrapper>
    </>
  );
};
