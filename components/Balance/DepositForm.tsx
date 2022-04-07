import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import useDepositToken from 'queries/useDepositToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IFormData, IFormElements } from './types';
import { checkApproval } from 'components/Form/utils';
import { InputAmount, SubmitButton } from 'components/Form';

const DepositForm = ({ data }: { data: IFormData }) => {
  const { mutate, isLoading } = useDepositToken();

  const [{ data: accountData }] = useAccount();

  const amountToDeposit = React.useRef('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    amountToDeposit.current = e.target.value;

    checkApproval({
      tokenDetails: {
        decimals: data.tokenDecimals,
        tokenContract: data.tokenContract,
        llamaContractAddress: data.llamaContractAddress,
      },
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
      checkTokenApproval,
    });
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & IFormElements;
    const amount = form.amount?.value;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(10 ** data.tokenDecimals);

      if (isApproved) {
        mutate({
          amountToDeposit: formattedAmt.toFixed(0),
          llamaContractAddress: data.llamaContractAddress,
        });
      } else {
        approveToken({
          tokenAddress: data.tokenAddress,
          amountToApprove: formattedAmt.toFixed(0),
          spenderAddress: data.llamaContractAddress,
        });
      }
    }
  };

  const disableApprove = approvingToken || checkingApproval;

  return (
    <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputAmount name="amount" label={`Amount ${data.symbol}`} handleChange={handleChange} isRequired />
      {isApproved ? (
        <SubmitButton disabled={isLoading} className="my-4 rounded bg-zinc-300 py-2 px-3 dark:bg-stone-600">
          {isLoading ? '...' : 'Deposit'}
        </SubmitButton>
      ) : (
        <SubmitButton disabled={disableApprove} className="my-4 rounded bg-zinc-300 py-2 px-3 dark:bg-stone-600">
          {disableApprove ? '...' : 'Approve'}
        </SubmitButton>
      )}
    </form>
  );
};

export default DepositForm;
