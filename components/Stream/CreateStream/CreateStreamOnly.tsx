import * as React from 'react';
import BigNumber from 'bignumber.js';
import { IStreamFormProps, IFormElements } from './types';
import useStreamToken from 'queries/useStreamToken';
import { InputText, InputWithToken, SubmitButton } from 'components/Form';

const CreateStreamOnly = ({ tokens, tokenOptions }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState('');

  // Handle changes in form
  const handleTokenChange = (token: string) => {
    const data = tokens.find((t) => t.name === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
    } else setTokenAddress(token);
  };

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
        // convert amount to bignumber based on token decimals
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(10 ** tokenDetails.decimals);

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
      <InputWithToken
        name="amountPerSec"
        handleTokenChange={handleTokenChange}
        tokens={tokenOptions}
        isRequired={true}
        className="pr-[32%]"
        label="Amount per sec"
      />
      <SubmitButton disabled={isLoading} className="mt-8">
        {isLoading ? '...' : 'Create Stream'}
      </SubmitButton>
    </form>
  );
};

export default CreateStreamOnly;
