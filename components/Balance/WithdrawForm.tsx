import * as React from 'react';
import useWithdrawByPayer from 'queries/useWithdrawTokenByPayer';
import { IFormData, IFormElements } from './types';
import { checkIsAmountValid } from 'components/Stream/utils';
import BigNumber from 'bignumber.js';

const WithdrawForm = ({ data }: { data: IFormData }) => {
  const { mutate, isLoading } = useWithdrawByPayer();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amount = form.amount.value;
    // check if amount is valid
    const isAmountValid = checkIsAmountValid(amount);

    if (isAmountValid) {
      const formattedAmt = new BigNumber(amount).multipliedBy(1e20);

      mutate({
        amountToWithdraw: formattedAmt.toFixed(0),
        llamaContractAddress: data.llamaContractAddress,
        withdrawAll: false,
      });
    }
  };

  const withdrawAllTokens = () => {
    mutate({
      llamaContractAddress: data.llamaContractAddress,
      withdrawAll: true,
    });
  };

  return (
    <>
      <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
        <label className="flex flex-col space-y-1">
          <span>{data.symbol ? `Amount (${data.symbol})` : 'Amount'}</span>
          <input type="text" className="rounded border px-3 py-[6px]" name="amount" required />
        </label>
        <button className="nav-button disabled:cursor-not-allowed" disabled={isLoading}>
          Withdraw
        </button>
      </form>
      <p className="my-3 text-center font-light">or</p>
      <button
        className="nav-button w-full disabled:cursor-not-allowed"
        disabled={isLoading}
        onClick={withdrawAllTokens}
      >
        Withdraw All
      </button>
    </>
  );
};

export default WithdrawForm;
