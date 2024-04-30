import * as React from 'react';
import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog } from '~/components/Dialog';
import { SubmitButton } from '~/components/Form';
import { useIntl } from 'next-intl';
import { useContractWrite } from 'wagmi';
import { vestingFactoryReadableABI } from '~/lib/abis/vestingFactoryReadable';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { TransactionDialog } from '~/components/Dialog';
import { BeatLoader } from '~/components/BeatLoader';

export interface IVestingData {
  recipientAddress: string;
  vestedToken: string;
  tokenDecimals: number;
  vestingAmount: string;
  vestingDuration: string;
  cliffTime: string;
  startTime: string;
  openClaim: boolean;
}

interface IConfirmProps {
  vestingData: IVestingData;
  dialog: DisclosureState;
  factory: string;
}

export default function Confirm({ vestingData, dialog, factory }: IConfirmProps) {
  const intl = useIntl();

  const [transactionHash, setTransactionHash] = React.useState<string>('');

  const queryClient = useQueryClient();

  const { writeAsync: deploy_vesting_contract, isLoading } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: factory as `0x${string}`,
    abi: vestingFactoryReadableABI,
    functionName: 'deploy_vesting_contract',
  });

  const transactionDialog = useDialogState();

  function onConfirm() {
    if (!vestingData) return;
    deploy_vesting_contract({
      recklesslySetUnpreparedArgs: [
        vestingData?.vestedToken,
        vestingData?.recipientAddress,
        vestingData?.vestingAmount,
        vestingData?.vestingDuration,
        vestingData?.startTime,
        vestingData?.cliffTime,
        vestingData?.openClaim,
      ],
    })
      .then((tx) => {
        const toastid = toast.loading('Creating Contract');
        setTransactionHash(tx.hash);
        dialog.hide();
        transactionDialog.show();
        tx.wait().then((receipt) => {
          toast.dismiss(toastid);
          if (receipt.status === 1) {
            toast.success('Successfuly Created Contract');
          } else {
            toast.error('Failed to Create Contract');
          }
          queryClient.invalidateQueries();
        });
      })
      .catch((err) => {
        toast.error(err.reason || err.message || 'Transaction Failed');
      });
  }

  return (
    <>
      <FormDialog dialog={dialog} title={'Confirm Vesting Contract'}>
        <div className="space-y-4">
          <div className="font-exo my-1 rounded border p-2 dark:border-stone-700 dark:text-white">
            <p>{`Recipient: ${vestingData?.recipientAddress}`}</p>
            <p>{`Token: ${vestingData?.vestedToken}`}</p>
            <p>{`Amount: ${(Number(vestingData?.vestingAmount) / 10 ** vestingData?.tokenDecimals).toFixed(18)}`}</p>
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
              new Date((Number(vestingData.startTime) + Number(vestingData.vestingDuration)) * 1e3),
              {
                dateStyle: 'short',
                timeStyle: 'short',
              }
            )} (${intl.formatDateTime(
              new Date((Number(vestingData.startTime) + Number(vestingData.vestingDuration)) * 1e3),
              {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'utc',
              }
            )} UTC) `}</p>
          </div>
          <SubmitButton className="mt-5" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? <BeatLoader size="6px" color="white" /> : 'Confirm Transaction'}
          </SubmitButton>
        </div>
      </FormDialog>{' '}
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}
