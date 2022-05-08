import * as React from 'react';
import { useDialogState } from 'ariakit';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { IStream } from 'types';
import { useAddressStore } from 'store/address';
import { InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import useModifyStream from 'queries/useModifyStream';
import { BeatLoader } from 'react-spinners';
import { useIntl, useTranslations } from 'next-intl';

interface ModifyProps {
  data: IStream;
}

interface IUpdatedFormElements {
  updatedAddress: { value: string };
  updatedAmount: { value: string };
  modifiedStreamDuration: { value: 'month' | 'year' };
}

export const Modify = ({ data }: ModifyProps) => {
  const amountPerSec = Number(data.amountPerSec) / 1e20;

  const dialog = useDialogState();

  const { mutate: modifyStream, isLoading, data: transaction } = useModifyStream();

  const transactionDialog = useDialogState();

  const savedAddressName =
    useAddressStore((state) => state.addressBook.find((p) => p.id === data.payeeAddress))?.shortName ??
    data.payeeAddress;

  const updateStream = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & IUpdatedFormElements;
    const updatedAddress = form.updatedAddress?.value;
    const updatedAmount = form.updatedAmount?.value;
    const modifiedStreamDuration = form.modifiedStreamDuration?.value;

    const duration = modifiedStreamDuration || 'month';

    const updatedAmountPerSec = new BigNumber(updatedAmount).times(1e20).div(secondsByDuration[duration]).toFixed(0);

    modifyStream(
      {
        llamaContractAddress: data.llamaContractAddress,
        payeeAddress: data.payeeAddress,
        amountPerSec: data.amountPerSec,
        updatedAddress,
        updatedAmountPerSec,
      },
      {
        onSettled: () => {
          dialog.toggle();
          transactionDialog.toggle();
        },
      }
    );
  };

  const intl = useIntl();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Streams');
  const t2 = useTranslations('Forms');

  return (
    <>
      <button className="row-action-links dark:text-white" onClick={dialog.toggle}>
        {t1('modify')}
      </button>
      <FormDialog dialog={dialog} title={t1('modify')} className="h-min">
        <span className="space-y-4 text-[#303030]">
          <section>
            <h2 className="font-medium text-[#3D3D3D] dark:text-white">{t2('currentStream')}</h2>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex items-center space-x-2">
                <span className="dark:text-white">{t0('you')}</span>
                <ArrowRightIcon className="h-4 w-4 dark:text-white" />
                <span className="truncate dark:text-white">{savedAddressName}</span>
              </div>
              <div className="inline-block space-x-2">
                <span className="dark:text-white">{t0('payee')}:</span>
                <span className="truncate dark:text-white">{data.payeeAddress}</span>
              </div>
              <p className="whitespace-nowrap dark:text-white">
                {`${t0('amount')}: ${intl.formatNumber(amountPerSec * secondsByDuration.month, {
                  maximumFractionDigits: 5,
                  minimumFractionDigits: 5,
                })} ${data.token?.symbol ?? ''}`}
              </p>
            </div>
          </section>
          <section>
            <h2 className="my-1 font-medium text-[#3D3D3D] dark:text-white">{t2('updateStream')}</h2>
            <form
              className="flex flex-col gap-4 rounded border px-2 pt-[2px] dark:border-stone-700 dark:text-white"
              onSubmit={updateStream}
            >
              <InputText
                name="updatedAddress"
                className="dark:bg-[#121212] dark:text-white"
                label={t0('address')}
                isRequired
                placeholder={t2('recipientAddress')}
              />

              <InputAmountWithDuration
                name="updatedAmount"
                className="dark:bg-[#121212] dark:text-white"
                label={t0('amount')}
                selectInputName="modifiedStreamDuration"
                isRequired
              />

              <SubmitButton className="my-2">
                {isLoading ? <BeatLoader size={6} color="white" /> : t0('update')}
              </SubmitButton>
            </form>
          </section>
        </span>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};
