import * as React from 'react';
import Select from 'react-select';
import BigNumber from 'bignumber.js';
import { IStreamFormProps, IFormElements } from './types';
import { checkIsAmountValid } from '../utils';
import useStreamToken from 'queries/useStreamToken';

const CreateStreamOnly = (props: IStreamFormProps) => {
  const { tokens, tokenOptions, isDark } = props;

  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const tokenAddress = form.tokenAddress.value;
    const amountPerSec = form.amountPerSec.value;
    const payeeAddress = form.addressToStream.value;

    if (tokenAddress !== '') {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      // check if amounts are valid against empty strings/valid numbers
      const isAmountPerSecValid = checkIsAmountValid(amountPerSec);

      if (tokenDetails && isAmountPerSecValid && payeeAddress) {
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
      <label>
        <p>Select a token to stream</p>
        <Select
          options={tokenOptions}
          classNamePrefix="react-select"
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary25: isDark ? '#52525b' : 'rgb(244 244 245)',
              primary: '#3f3f46',
            },
          })}
          name="tokenAddress"
        />
      </label>
      <label>
        <p>Address to stream</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="addressToStream"
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <label>
        <p>Amount per sec</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="amountPerSec"
          pattern="\S(.*\S)?"
          title="This field is required"
        />
      </label>
      <button className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed" disabled={isLoading}>
        {isLoading ? '...' : 'Create Stream'}
      </button>
    </form>
  );
};

export default CreateStreamOnly;
