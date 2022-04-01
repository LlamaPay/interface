import * as React from 'react';
import { checkIsAmountValid } from 'components/Stream/utils';
import BigNumber from 'bignumber.js';
import { IFormData, IFormElements } from './types';
import useDepositToken from 'queries/useDepositToken';
import { useAccount } from 'wagmi';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';

const DepositForm = ({ data }: { data: IFormData }) => {
  const { mutate, isLoading } = useDepositToken();

  const [{ data: accountData }] = useAccount();

  const amountToDeposit = React.useRef('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  // TODO implement debounce
  function checkApproval(e: React.ChangeEvent<HTMLInputElement>) {
    amountToDeposit.current = e.target.value;

    const isAmountValid = checkIsAmountValid(amountToDeposit.current) && data?.tokenDecimals;

    if (accountData?.address && isAmountValid) {
      const bigAmount = new BigNumber(amountToDeposit.current).multipliedBy(10 ** data.tokenDecimals);

      checkTokenApproval({
        token: data.tokenContract,
        userAddress: accountData?.address,
        approveForAddress: data.llamaContractAddress,
        approvedForAmount: bigAmount.toFixed(0),
      });
    }
  }

  const handleTokenApproval = () => {
    const isAmountValid = checkIsAmountValid(amountToDeposit.current) && data?.tokenDecimals;

    if (isAmountValid) {
      const bigAmount = new BigNumber(amountToDeposit.current).multipliedBy(10 ** data.tokenDecimals);

      approveToken({
        tokenAddress: data.tokenAddress,
        amountToApprove: bigAmount.toFixed(0),
        spenderAddress: data.llamaContractAddress,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & IFormElements;
    const amount = form.amount.value;
    // check if amount is valid
    const isAmountValid = checkIsAmountValid(amount);

    if (isAmountValid) {
      const formattedAmt = new BigNumber(amount).multipliedBy(10 ** data.tokenDecimals);

      mutate({
        amountToDeposit: formattedAmt.toFixed(0),
        llamaContractAddress: data.llamaContractAddress,
      });
    }
  };

  return (
    <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
      <label className="flex flex-col space-y-1">
        <span>{data.symbol ? `Amount (${data.symbol})` : 'Amount'}</span>
        <input type="text" className="rounded border px-3 py-[6px]" name="amount" required onChange={checkApproval} />
      </label>
      {isApproved ? (
        <button className="nav-button disabled:cursor-not-allowed" disabled={isLoading}>
          {isLoading ? '...' : 'Deposit'}
        </button>
      ) : (
        <button
          className="nav-button disabled:cursor-not-allowed"
          disabled={checkingApproval || approvingToken}
          onClick={handleTokenApproval}
          type="button"
        >
          {checkingApproval || approvingToken ? '...' : 'Approve'}
        </button>
      )}
    </form>
  );
};

export default DepositForm;
