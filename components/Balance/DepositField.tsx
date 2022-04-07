import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputWithTokenSelect, SubmitButton } from 'components/Form';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import useDepositToken from 'queries/useDepositToken';
import { IToken } from 'types';

const DepositField = ({ tokens }: { tokens: IToken[] }) => {
  const { mutate: deposit, isLoading } = useDepositToken();

  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // read amountToDeposit from form element
    // make sure it matches the name prop on that element
    const form = e.target as typeof e.target & { amountToDeposit: { value: string } };
    const amountToDeposit = form.amountToDeposit?.value;

    // make sure we are setting tokenAddress in the setTokenAddress and not name or symbol
    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (tokenDetails && amountToDeposit) {
      // format amount to bignumber
      const bigAmount = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails?.decimals);

      // call deposit method only if token is approved to spend
      if (isApproved && tokenDetails.llamaContractAddress) {
        deposit({
          amountToDeposit: bigAmount.toFixed(0),
          llamaContractAddress: tokenDetails.llamaContractAddress,
        });
      } else {
        approveToken({
          tokenAddress: tokenAddress,
          amountToApprove: bigAmount.toFixed(0),
          spenderAddress: tokenDetails.llamaContractAddress,
        });
      }
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <form onSubmit={handleSubmit}>
      <InputWithTokenSelect
        name="amountToDeposit"
        label="Amount"
        tokenAddress={tokenAddress}
        setTokenAddress={setTokenAddress}
        checkTokenApproval={checkTokenApproval}
        isRequired
      />
      {isApproved ? (
        <SubmitButton disabled={isLoading} className="dark:!staticbg-stone-600 mt-4 rounded !bg-zinc-300 py-2 px-3">
          {isLoading ? '...' : 'Deposit'}
        </SubmitButton>
      ) : (
        <SubmitButton disabled={disableApprove} className="mt-4 rounded !bg-zinc-300 py-2 px-3 dark:!bg-stone-600">
          {disableApprove ? '...' : 'Approve'}
        </SubmitButton>
      )}
    </form>
  );
};

export default DepositField;
