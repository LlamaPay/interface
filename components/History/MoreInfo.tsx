import { DialogHeader, DialogWrapper, SetIsOpen } from 'components/Dialog';

interface MoreInfoProps {
  isOpen: boolean;
  setIsOpen: SetIsOpen;
  eventType: string;
  payer: string;
  payee: string;
  amtPerSec: number;
  oldAmtPerSec: number | null;
  oldPayee: string | null;
  createdTime: string;
}

export const MoreInfo = ({
  isOpen,
  setIsOpen,
  payer,
  payee,
  amtPerSec,
  oldAmtPerSec,
  oldPayee,
  createdTime,
}: MoreInfoProps) => {
  return (
    <>
      <DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DialogHeader title="More Info" setIsOpen={setIsOpen} />
        <div className="mt-3 flex flex-col space-y-2"></div>
      </DialogWrapper>
    </>
  );
};
