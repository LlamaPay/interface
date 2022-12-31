import * as React from 'react';
import { llamaContractABI } from '~/lib/abis/llamaContract';
import { useDialogState } from 'ariakit';
import { TransactionDialog } from '~/components/Dialog';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';
import type { IStream, ITransaction } from '~/types';
import { useContractWrite } from 'wagmi';
import { useTranslations } from 'next-intl';
import { LlamaContractInterface } from '~/utils/contract';
import useGnosisBatch from '~/queries/useGnosisBatch';
import classNames from 'classnames';

interface PushProps {
  buttonName: 'Send' | 'Withdraw';
  data: IStream;
  className?: string;
}

export const Push = ({ data, buttonName, className }: PushProps) => {
  const [transactionHash, setTransactionHash] = React.useState<string | null>(null);

  const [{}, withdraw] = useContractWrite(
    {
      addressOrName: data.llamaContractAddress,
      contractInterface: llamaContractABI,
    },
    'withdraw',
    {
      args: [data.payerAddress, data.payeeAddress, data.amountPerSec],
    }
  );
  const { mutate: gnosisBatch } = useGnosisBatch();
  const queryClient = useQueryClient();

  const transactionDialog = useDialogState();

  const handleClick = () => {
    if (process.env.NEXT_PUBLIC_SAFE === 'true') {
      const call: { [key: string]: string[] } = {};
      call[data.llamaContractAddress] = [
        LlamaContractInterface.encodeFunctionData('withdraw', [
          data.payerAddress,
          data.payeeAddress,
          data.amountPerSec,
        ]),
      ];
      gnosisBatch({ calls: call });
    } else {
      withdraw().then(({ data, error }: ITransaction) => {
        if (data) {
          setTransactionHash(data.hash ?? null);

          transactionDialog.toggle();

          const toastId = toast.loading(buttonName === 'Withdraw' ? 'Withdrawing Payment' : 'Sending Payment');

          data.wait().then((receipt) => {
            toast.dismiss(toastId);

            queryClient.invalidateQueries();

            receipt.status === 1
              ? toast.success(
                  buttonName === 'Withdraw' ? 'Successfully Withdrawn Payment' : 'Successfully Sent Payment'
                )
              : toast.error(buttonName === 'Withdraw' ? 'Failed to Withdraw Payment' : 'Failed to Send Payment');
          });
        }

        if (error) {
          toast.error(error.message || 'Transaction Failed');
        }
      });
    }
  };

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');

  return (
    <>
      {data.paused ? (
        ''
      ) : (
        <button
          onClick={handleClick}
          className={classNames('primary-button my-[-2px] px-3 py-1 text-sm  font-medium shadow-none', className)}
        >
          {buttonName === 'Withdraw' ? t0('withdraw') : t1('send')}
        </button>
      )}
      {transactionHash && <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />}
    </>
  );
};
