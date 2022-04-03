import * as React from 'react';
import BigNumber from 'bignumber.js';
import { IStreamFormProps, IFormElements } from './types';
import { checkIsAmountValid } from '../utils';
import useStreamToken from 'queries/useStreamToken';

const CreateStreamOnly = ({ tokens }: IStreamFormProps) => {
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

  return <form className="flex flex-col space-y-4" onSubmit={handleSubmit}></form>;
};

export default CreateStreamOnly;
