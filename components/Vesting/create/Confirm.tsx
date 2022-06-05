import { DisclosureState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import { SubmitButton } from 'components/Form';
import { useIntl } from 'next-intl';

export interface IVestingData {
  recipientAddress: string;
  vestedToken: string;
  tokenDecimals: number;
  vestingAmount: string;
  vestingDuration: string;
  cliffTime: string;
  startTime: string;
}

interface IConfirmProps {
  vestingData: IVestingData;
  dialog: DisclosureState;
  onConfirm: () => void;
}

export default function Confirm({ vestingData, dialog, onConfirm }: IConfirmProps) {
  const intl = useIntl();

  return (
    <FormDialog dialog={dialog} title={'Confirm Vesting Contract'}>
      <div className="space-y-4">
        <div className="font-exo my-1 rounded border p-2 dark:border-stone-700 dark:text-white">
          <p>{`Recipient: ${vestingData?.recipientAddress}`}</p>
          <p>{`Token: ${vestingData?.vestedToken}`}</p>
          <p>{`Amount: ${(Number(vestingData?.vestingAmount) / 10 ** vestingData?.tokenDecimals).toFixed(5)}`}</p>
          <p>{`Starts: ${intl.formatDateTime(new Date(Number(vestingData.startTime) * 1e3), {
            dateStyle: 'short',
            timeStyle: 'short',
          })} (${intl.formatDateTime(new Date(Number(vestingData.startTime) * 1e3), {
            dateStyle: 'short',
            timeStyle: 'short',
            timeZone: 'utc',
          })} UTC)`}</p>
          {vestingData.cliffTime !== '0' && (
            <>
              <p>{`Cliff Duration: ${(Number(vestingData.cliffTime) / 86400).toFixed(2)} days`}</p>
              <p>{`Cliff Ends: ${intl.formatDateTime(
                new Date((Number(vestingData.startTime) + Number(vestingData.cliffTime)) * 1e3),
                {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }
              )} (${intl.formatDateTime(
                new Date((Number(vestingData.startTime) + Number(vestingData.cliffTime)) * 1e3),
                {
                  dateStyle: 'short',
                  timeStyle: 'short',
                  timeZone: 'utc',
                }
              )} UTC)`}</p>
            </>
          )}
          <p>{`Ends: ${intl.formatDateTime(
            new Date(
              (Number(vestingData.startTime) + Number(vestingData.cliffTime) + Number(vestingData.vestingDuration)) *
                1e3
            ),
            {
              dateStyle: 'short',
              timeStyle: 'short',
            }
          )} (${intl.formatDateTime(
            new Date(
              (Number(vestingData.startTime) + Number(vestingData.cliffTime) + Number(vestingData.vestingDuration)) *
                1e3
            ),
            {
              dateStyle: 'short',
              timeStyle: 'short',
              timeZone: 'utc',
            }
          )} UTC) `}</p>
        </div>
        <SubmitButton className="mt-5" onClick={onConfirm}>
          Confirm Transaction
        </SubmitButton>
      </div>
    </FormDialog>
  );
}
