import * as React from 'react';
import { DisclosureState, useDialogState } from 'ariakit';
import { ArrowRightIcon } from '@heroicons/react/solid';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { IStream } from 'types';
import { useAddressStore } from 'store/address';
import { InputAmountWithDuration, InputText, SubmitButton } from 'components/Form';
import BigNumber from 'bignumber.js';
import { secondsByDuration } from 'utils/constants';
import useModifyStream from 'queries/useModifyStream';
import { BeatLoader } from 'react-spinners';
import { useLocale } from 'hooks';

interface ModifyProps {
  data: IStream;
  dialog: DisclosureState;
  title: string;
}

interface IUpdatedFormElements {
  updatedAddress: { value: string };
  updatedAmount: { value: string };
  modifiedStreamDuration: { value: 'month' | 'year' };
}

export const Modify = ({ data, dialog, title }: ModifyProps) => {
  const amountPerSec = Number(data.amountPerSec) / 1e20;

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

  const { locale } = useLocale();

  return (
    <>
      <FormDialog dialog={dialog} title={title} className="h-min">
        <span className="space-y-4 text-[#303030]">
          <section>
            <h2 className="font-medium text-[#3D3D3D]">Current Stream</h2>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <div className="flex items-center space-x-2">
                <span>You</span>
                <ArrowRightIcon className="h-4 w-4 " />
                <span className="truncate">{savedAddressName}</span>
              </div>
              <div className="inline-block space-x-2">
                <span>Payee:</span>
                <span className="truncate">{data.payeeAddress}</span>
              </div>
              <p className="whitespace-nowrap">
                {`Amount: ${(amountPerSec * secondsByDuration.month).toLocaleString(locale, {
                  maximumFractionDigits: 5,
                  minimumFractionDigits: 5,
                })} ${data.token?.symbol ?? ''}`}
              </p>
            </div>
          </section>
          <section>
            <h2 className="my-1 font-medium text-[#3D3D3D]">Update Stream</h2>
            <form
              className="flex flex-col gap-4 rounded border px-2 pt-[2px] dark:border-stone-700"
              onSubmit={updateStream}
            >
              <InputText name="updatedAddress" label="Address" isRequired />
              <InputAmountWithDuration
                name="updatedAmount"
                label="Amount"
                selectInputName="modifiedStreamDuration"
                isRequired
              />
              <SubmitButton className="my-2">
                {isLoading ? <BeatLoader size={6} color="white" /> : 'Update'}
              </SubmitButton>
            </form>
          </section>
        </span>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};
