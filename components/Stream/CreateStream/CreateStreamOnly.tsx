import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputText, InputWithTokenSelect, SubmitButton } from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { IStreamFormProps, IFormElements } from './types';

const CreateStreamOnly = ({ tokens }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState('');

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amountPerSec = form.amountPerSec.value;
    const payeeAddress = form.addressToStream.value;

    if (tokenAddress !== '' && payeeAddress) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
        // format amount to bignumber
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(1e20);

        // query mutation
        streamToken({
          method: 'CREATE_STREAM',
          amountPerSec: amtPerSec.toFixed(0),
          payeeAddress: payeeAddress,
          llamaContractAddress: tokenDetails?.llamaContractAddress,
        });
      }
    }
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputText name="addressToStream" isRequired={true} label="Address to stream" />
      <InputWithTokenSelect
        name="amountPerSec"
        label="Amount per sec"
        tokenAddress={tokenAddress}
        setTokenAddress={setTokenAddress}
        isRequired
      />
      <SubmitButton disabled={isLoading} className="mt-8">
        {isLoading ? '...' : 'Create Stream'}
      </SubmitButton>
    </form>
  );
};

export default CreateStreamOnly;
