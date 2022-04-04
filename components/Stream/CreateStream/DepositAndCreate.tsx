import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputAmount, InputText, InputWithTokenSelect, SubmitButton } from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IStreamFormProps, IFormElements } from './types';

const DepositAndCreate = ({ tokens }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;

    const amountPerSec = form.amountPerSec?.value;
    const amountToDeposit = form.amountToDeposit?.value;
    const payeeAddress = form.addressToStream?.value;

    if (tokenAddress !== '') {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
        // format amount to bignumber
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(1e20);
        const amtToDeposit = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails.decimals);

        // query mutation

        if (isApproved) {
          streamToken({
            method: 'DEPOSIT_AND_CREATE',
            amountPerSec: amtPerSec.toFixed(0),
            amountToDeposit: amtToDeposit.toFixed(0),
            payeeAddress: payeeAddress,
            llamaContractAddress: tokenDetails?.llamaContractAddress,
          });
        } else {
          console.log('ABOUT TO APPROVE');
          approveToken({
            tokenAddress: tokenAddress,
            spenderAddress: tokenDetails.llamaContractAddress,
            amountToApprove: amtToDeposit.toFixed(0), // approve for amount to deposit
          });
        }
      }
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputWithTokenSelect
        name="amountToDeposit"
        label="Deposit"
        tokenAddress={tokenAddress}
        setTokenAddress={setTokenAddress}
        checkTokenApproval={checkTokenApproval}
        isRequired
      />

      <InputText name="addressToStream" isRequired={true} label="Address to stream" />

      <InputAmount name="amountPerSec" isRequired={true} label="Amount per sec" />

      {isApproved ? (
        <SubmitButton disabled={isLoading} className="mt-8">
          {isLoading ? '...' : 'Deposit and Create Stream'}
        </SubmitButton>
      ) : (
        <SubmitButton disabled={disableApprove} className="mt-4">
          {disableApprove ? '...' : 'Approve'}
        </SubmitButton>
      )}
    </form>
  );
};

export default DepositAndCreate;
