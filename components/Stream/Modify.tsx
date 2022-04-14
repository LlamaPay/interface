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

  return (
    <>
      <FormDialog dialog={dialog} title={title} className="h-min">
        <span className="space-y-4">
          <section>
            <h2 className="">Current stream: </h2>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <p className="flex items-center space-x-2">
                <span>You</span>
                <ArrowRightIcon className="h-4 w-4" />
                <span className="truncate">{savedAddressName}</span>
              </p>
              <p>
                <span>Amount / sec: </span>
                {amountPerSec.toLocaleString('en-US', {
                  maximumFractionDigits: 7,
                  minimumFractionDigits: 7,
                })}
              </p>
            </div>
          </section>
          <section>
            <h2 className="">Update stream: </h2>
            <form className="my-1 space-y-3 rounded border p-2 dark:border-stone-700" onSubmit={updateStream}>
              <InputText name="updatedAddress" label="Address" isRequired />
              <InputAmountWithDuration
                name="updatedAmount"
                label="Amount"
                selectInputName="modifiedStreamDuration"
                isRequired
              />
              <SubmitButton className="!mt-5 !bg-zinc-300 py-2 px-3 dark:!bg-stone-600">
                {isLoading ? <BeatLoader size={6} color="#171717" /> : 'Update'}
              </SubmitButton>
            </form>
          </section>
        </span>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};
