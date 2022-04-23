import * as React from 'react';
import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import { IStreamFormProps } from './types';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from 'components/Dialog';
import { useCreateStreamForm } from 'hooks';

const CreateStreamOnly = ({ tokens, dialog }: IStreamFormProps) => {
  const { tokenOptions, handleTokenChange, handleSubmit, transactionDetails, confirmingStream } = useCreateStreamForm({
    tokens,
    dialog,
  });

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputText name="addressToStream" isRequired={true} label="Enter an Address to Stream" />
        <span>
          <SelectToken
            handleTokenChange={handleTokenChange}
            tokens={tokenOptions}
            className="border border-neutral-300 bg-transparent py-[3px] shadow-none dark:border-neutral-700 dark:bg-stone-800"
            label="Select Token from Balances"
          />
        </span>

        <InputAmountWithDuration
          name="amountToStream"
          isRequired={true}
          label="Amount to Stream"
          selectInputName="streamDuration"
        />

        <SubmitButton disabled={confirmingStream}>
          {confirmingStream ? <BeatLoader size={6} color="white" /> : 'Create Stream'}
        </SubmitButton>
      </form>
      <TransactionDialog dialog={dialog} transactionHash={transactionDetails?.hash ?? ''} />
    </>
  );
};

export default CreateStreamOnly;
