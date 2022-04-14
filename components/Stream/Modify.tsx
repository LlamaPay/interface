import * as React from 'react';
import { DisclosureState, useDialogState } from 'ariakit';
import { PencilIcon } from '@heroicons/react/solid';
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
  const [editName, setEditName] = React.useState(false);
  const amountPerSec = Number(data.amountPerSec) / 1e20;

  const { mutate: modifyStream, isLoading, data: transaction } = useModifyStream();

  const updateAddress = useAddressStore((state) => state.updateAddress);

  const transactionDialog = useDialogState();

  const savedAddressName =
    useAddressStore((state) => state.payeeAddresses.find((p) => p.id === data.payeeAddress))?.shortName ??
    data.payeeAddress;

  const [payeeAddress, setPayeeAddress] = React.useState(savedAddressName);

  const updateName = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateAddress(data.payeeAddress, payeeAddress);
    setEditName(false);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayeeAddress(e.target.value);
  };

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
            <h1 className="">Payee Address</h1>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              {editName ? (
                <form className="flex items-center justify-between" onSubmit={updateName}>
                  <input
                    value={payeeAddress}
                    onChange={handleAddressChange}
                    autoFocus
                    required
                    className="w-full rounded p-1"
                  />
                  <button className="ml-2 rounded bg-zinc-300 py-1 px-[6px] dark:bg-stone-600">Save</button>
                </form>
              ) : (
                <p className="flex items-center justify-between">
                  <span className="truncate py-1">{payeeAddress}</span>
                  <button
                    className="rounded bg-zinc-300 p-1 dark:bg-stone-600"
                    autoFocus
                    onClick={() => setEditName(true)}
                  >
                    <span className="sr-only">Edit payee address name</span>
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </p>
              )}
              <small className="truncate opacity-70">({data.payeeAddress})</small>
            </div>
          </section>
          <section>
            <h2 className="">Current stream: </h2>
            <div className="my-1 rounded border p-2 dark:border-stone-700">
              <p className="flex items-center space-x-2">
                <span>You</span>
                <ArrowRightIcon className="h-4 w-4" />
                <span className="truncate">{payeeAddress}</span>
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
