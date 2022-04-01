import * as React from 'react';
import Select, { OnChangeValue } from 'react-select';
import BigNumber from 'bignumber.js';
import { checkIsAmountValid } from '../utils';
import { IStreamFormProps, IFormElements, TokenOption, ICheckApproval } from './types';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useAccount } from 'wagmi';
import { getAddress } from 'ethers/lib/utils';

const DepositAndCreate = (props: IStreamFormProps) => {
  const { tokens, tokenOptions, isDark } = props;

  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  const [{ data: accountData }] = useAccount();

  // store form values
  const tokenAddress = React.useRef('');
  const amountToDeposit = React.useRef('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  // function to check if a token is approved
  // TODO implement debounce
  function checkApproval({ tokenAddress, userAddress, approvedForAmount }: ICheckApproval) {
    if (tokenAddress && userAddress) {
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;
      const isAmountValid = checkIsAmountValid(approvedForAmount) && tokenDetails?.decimals;
      if (tokenDetails && isAmountValid) {
        const amount = new BigNumber(approvedForAmount).multipliedBy(10 ** tokenDetails.decimals);

        checkTokenApproval({
          token: tokenDetails.tokenContract,
          userAddress: userAddress,
          approveForAddress: tokenDetails.llamaContractAddress,
          approvedForAmount: amount.toFixed(0),
        });
      }
    }
  }

  // Handle changes in form
  const handleTokenChange = (token: OnChangeValue<TokenOption, false>) => {
    tokenAddress.current = token?.value ?? '';
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountToDeposit.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  // approve token on click
  const handleApproval = () => {
    const amountToApprove = amountToDeposit.current;

    if (tokenAddress.current !== '' && amountToApprove !== '') {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress.current) ?? null;

      // check if amount is valid against empty strings/valid numbers
      const isAmountValid = checkIsAmountValid(amountToApprove) && tokenDetails?.decimals;

      if (tokenDetails && isAmountValid) {
        // convert amount to bignumber based on token decimals
        const amount = new BigNumber(amountToApprove).multipliedBy(10 ** tokenDetails.decimals);

        // query mutation
        approveToken({
          tokenAddress: getAddress(tokenAddress.current),
          spenderAddress: getAddress(tokenDetails.llamaContractAddress),
          amountToApprove: amount.toFixed(0),
        });
      }
    }
  };

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const tokenAddress = form.tokenAddress.value;
    const amountPerSec = form.amountPerSec.value;
    const amountToDeposit = form.amountToDeposit.value;
    const payeeAddress = form.addressToStream.value;

    if (tokenAddress !== '' && isApproved) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      // check if amounts are valid against empty strings/valid numbers
      const isAmountPerSecValid = checkIsAmountValid(amountPerSec);

      // check for deposit amount only when depositAndCreate form is shown
      const isAmountToDepositValid = checkIsAmountValid(amountToDeposit);

      if (tokenDetails && isAmountPerSecValid && isAmountToDepositValid && payeeAddress) {
        // convert amount to bignumber based on token decimals
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(10 ** tokenDetails.decimals);
        const amtToDeposit = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails.decimals);

        // query mutation
        streamToken({
          method: 'DEPOSIT_AND_CREATE',
          amountPerSec: amtPerSec.toFixed(0),
          amountToDeposit: amtToDeposit.toFixed(0),
          payeeAddress: payeeAddress,
          llamaContractAddress: tokenDetails?.llamaContractAddress,
        });
      }
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <label>
        <p>Select a token to deposit and stream</p>
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
          onChange={handleTokenChange}
          name="tokenAddress"
        />
      </label>
      <label>
        <p>Amount to deposit</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-[6px]"
          name="amountToDeposit"
          onChange={handleDepositChange}
          pattern="\S(.*\S)?"
          title="This field is required"
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
      {isApproved ? (
        <button className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed" disabled={isLoading}>
          {isLoading ? '...' : 'Create Stream'}
        </button>
      ) : (
        <button
          className="nav-button mx-auto mt-2 w-full disabled:cursor-not-allowed"
          type="button"
          disabled={disableApprove}
          onClick={handleApproval}
        >
          {disableApprove ? '...' : 'Approve'}
        </button>
      )}
    </form>
  );
};

export default DepositAndCreate;
