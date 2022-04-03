import * as React from 'react';
import BigNumber from 'bignumber.js';
import { checkIsAmountValid } from '../utils';
import { IStreamFormProps, IFormElements, ICheckApproval } from './types';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useAccount } from 'wagmi';
import { getAddress } from 'ethers/lib/utils';
import { InputAmount, InputText, InputWithToken, SubmitButton } from 'components/Form';

const DepositAndCreate = ({ tokens }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  const [{ data: accountData }] = useAccount();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState('');

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
  const handleTokenChange = (token: string) => {
    setTokenAddress(token);
    checkApproval({
      tokenAddress: token,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountToDeposit.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  // approve token on click
  const handleApproval = () => {
    const amountToApprove = amountToDeposit.current;

    if (tokenAddress !== '' && amountToApprove !== '') {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      // check if amount is valid against empty strings/valid numbers
      const isAmountValid = checkIsAmountValid(amountToApprove) && tokenDetails?.decimals;

      if (tokenDetails && isAmountValid) {
        // convert amount to bignumber based on token decimals
        const amount = new BigNumber(amountToApprove).multipliedBy(10 ** tokenDetails.decimals);

        // query mutation
        approveToken({
          tokenAddress: getAddress(tokenAddress),
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

    const amountPerSec = form.amountPerSec?.value;
    const amountToDeposit = form.amountToDeposit?.value;
    const payeeAddress = form.addressToStream?.value;

    if (tokenAddress !== '' && isApproved && payeeAddress) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
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

  const tokenAddresses = React.useMemo(() => tokens.map((t) => t.tokenAddress), [tokens]);

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      <InputWithToken
        name="amountToDeposit"
        handleChange={handleDepositChange}
        handleTokenChange={handleTokenChange}
        tokens={tokenAddresses}
        isRequired={true}
        className="pr-[32%]"
        label="Deposit"
      />

      <InputText name="addressToStream" isRequired={true} label="Address to stream" />

      <InputAmount name="amountPerSec" isRequired={true} label="Amount per sec" />

      {isApproved ? (
        <SubmitButton disabled={isLoading} className="mt-8">
          {isLoading ? '...' : 'Deposit and Create Stream'}
        </SubmitButton>
      ) : (
        <SubmitButton type="button" disabled={disableApprove} onClick={handleApproval} className="mt-4">
          {disableApprove ? '...' : 'Approve'}
        </SubmitButton>
      )}
    </form>
  );
};

export default DepositAndCreate;
