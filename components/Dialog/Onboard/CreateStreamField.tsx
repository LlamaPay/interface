import * as React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/solid';
import { useCreateStreamForm } from 'hooks';
import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import useTokenBalances, { ITokenBalance } from 'queries/useTokenBalances';
import AnimatedStream from 'components/AnimatedStream';
import useTokenList from 'hooks/useTokenList';

export default function CreateStreamField({
  setCreateStream,
}: {
  tokens: ITokenBalance[];
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { isLoading: listLoading } = useTokenList();
  const { data: tokens, isLoading: tokensLoading } = useTokenBalances();

  if (tokensLoading || listLoading) {
    return (
      <div className="mx-auto mt-12 px-7 sm:mt-[170px]">
        <div className="my-auto">
          <AnimatedStream />
        </div>
      </div>
    );
  }

  // TODO show no tokens placeholder
  if (!tokens) return null;

  return <Form tokens={tokens} setCreateStream={setCreateStream} />;
}

const Form = ({
  tokens,
  setCreateStream,
}: {
  tokens: ITokenBalance[];
  setCreateStream: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { tokenOptions, handleTokenChange, handleSubmit, confirmingStream } = useCreateStreamForm({
    tokens,
  });

  return (
    <>
      <form className="mx-auto mt-12 mb-7 flex w-full flex-1 flex-col gap-8 px-7 sm:mt-[104px]" onSubmit={handleSubmit}>
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
      <div className="m-7">
        <button
          className="form-submit-button mx-auto flex w-full max-w-xs items-center justify-center gap-2 bg-white text-[#23BD8F]"
          onClick={() => setCreateStream(false)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Deposit Token</span>
        </button>
      </div>
    </>
  );
};
