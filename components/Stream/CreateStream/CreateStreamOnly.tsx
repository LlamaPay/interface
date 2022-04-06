import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputAmountWithDuration, InputText, SelectToken, SubmitButton } from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { IStreamFormProps, IFormElements } from './types';
import { secondsByDuration } from 'utils/constants';

const CreateStreamOnly = ({ tokens }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.name === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
    }
  };

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amountToStream = form.amountToStream.value;
    const streamDuration = form.streamDuration?.value;
    const payeeAddress = form.addressToStream.value;

    const duration = streamDuration === 'year' ? 'year' : 'month';

    if (tokenAddress !== '' && payeeAddress) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
        // format amount to bignumber
        // convert amt to seconds
        const amtPerSec = new BigNumber(amountToStream).times(1e20).div(secondsByDuration[duration]);

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

  const tokenOptions = tokens.map((t) => t.name);

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputText name="addressToStream" isRequired={true} label="Address to stream" />
      <span>
        <SelectToken
          handleTokenChange={handleTokenChange}
          tokens={tokenOptions}
          className="border border-neutral-300 py-[3px] shadow-none dark:border-neutral-700"
          label="Token"
        />
      </span>

      <InputAmountWithDuration
        name="amountToStream"
        isRequired={true}
        label="Amount to stream"
        selectInputName="streamDuration"
      />

      <SubmitButton disabled={isLoading} className="mt-8">
        {isLoading ? '...' : 'Create Stream'}
      </SubmitButton>
    </form>
  );
};

export default CreateStreamOnly;
