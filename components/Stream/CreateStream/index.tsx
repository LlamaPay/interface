import * as React from 'react';
import { useTheme } from 'next-themes';
import { OnChangeValue } from 'react-select';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { useAccount } from 'wagmi';
import { getAddress } from 'ethers/lib/utils';
import useStreamToken from 'queries/useStreamToken';
import { checkIsAmountValid } from '../utils';
import BigNumber from 'bignumber.js';
import ErrorBoundary from './ErrorBoundary';
import Placeholder from './Placeholder';
import DepositAndCreate from './DepositAndCreate';
import CreateStreamOnly from './CreateStreamOnly';
import { ICheckApproval, ICreateProps, ICreateStreamForm, TokenOption, IFormElements } from './types';

export const CreateStream = ({ tokens, noBalances, isLoading, isError }: ICreateProps) => {
  return (
    <section className="z-2 flex w-full max-w-lg flex-col">
      <h1 className="mb-3 text-center text-xl">
        {noBalances && !isLoading ? 'Deposit and create a new stream' : 'Create a new stream'}
      </h1>
      {isLoading ? (
        <Placeholder />
      ) : isError || !tokens ? (
        <ErrorBoundary message="Something went wrong" />
      ) : (
        <Form balancesExist={!noBalances} tokens={tokens} />
      )}
    </section>
  );
};

const Form = ({ balancesExist, tokens }: ICreateStreamForm) => {
  const [{ data: accountData }] = useAccount();

  // Format tokens options to be used in select form element
  const tokenOptions = React.useMemo(
    () =>
      tokens?.map((c) => ({
        value: c.tokenAddress,
        label: `${c.name} (${c.symbol})`,
      })),
    [tokens]
  );

  // store form values
  const tokenAddress = React.useRef('');
  const amountToDeposit = React.useRef('');
  const amountPerSec = React.useRef('');

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const {
    mutate: checkTokenApproval,
    data: isApproved = false,
    isLoading: checkingApproval,
    error,
  } = useCheckTokenApproval();
  const {
    mutate: approveToken,
    data: approvedTransaction,
    isLoading: approvingToken,
    error: approvalError,
  } = useApproveToken();

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

    // if handling change in depositAndCreate form, check for amount to be deposited
    // else check for amountPerSec to be streamed
    if (balancesExist) {
      checkApproval({
        tokenAddress: tokenAddress.current,
        userAddress: accountData?.address,
        approvedForAmount: amountToDeposit.current,
      });
    } else {
      checkApproval({
        tokenAddress: tokenAddress.current,
        userAddress: accountData?.address,
        approvedForAmount: amountToDeposit.current,
      });
    }
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountToDeposit.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  const handleAmountPerSecChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountPerSec.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress.current,
      userAddress: accountData?.address,
      approvedForAmount: amountPerSec.current,
    });
  };

  // approve token on click
  const handleApproval = () => {
    // if approving amount in depositAndCreate form, pass amount to be deposited
    // else pass amountPerSec to be streamed
    const amountToApprove = balancesExist ? amountPerSec.current : amountToDeposit.current;

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

  // TODO handle error state in ui
  const { mutate: streamToken, isLoading, error: errorStreamingToken } = useStreamToken();

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;
    const amountPerSec = form.amountPerSec.value;
    const payeeAddress = form.addressToStream.value;

    if (tokenAddress.current !== '' && isApproved) {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress.current) ?? null;

      // check if amounts are valid against empty strings/valid numbers
      const isAmountPerSecValid = checkIsAmountValid(amountPerSec);

      // check for deposit amount only when depositAndCreate form is shown
      const isAmountToDepositValid = !balancesExist ? checkIsAmountValid(amountToDeposit.current) : true;

      if (tokenDetails && isAmountPerSecValid && isAmountToDepositValid && payeeAddress) {
        // convert amount to bignumber based on token decimals
        const amtPerSec = new BigNumber(amountPerSec).multipliedBy(10 ** tokenDetails.decimals);
        const amtToDeposit = !balancesExist
          ? new BigNumber(amountToDeposit.current).multipliedBy(10 ** tokenDetails.decimals)
          : 0;

        // query mutation
        streamToken({
          method: balancesExist ? 'CREATE_STREAM' : 'DEPOSIT_AND_CREATE',
          amountPerSec: amtPerSec.toFixed(0),
          amountToDeposit: amtToDeposit.toFixed(0),
          payeeAddress: payeeAddress,
          llamaContractAddress: tokenDetails?.llamaContractAddress,
        });
      }
    }
  };

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  if (error) return <ErrorBoundary message="Something went wrong" />;

  const isApproving = checkingApproval || approvingToken;
  const disableSubmit = isLoading || isApproving;

  const formProps = {
    tokenOptions,
    handleTokenChange,
    handleDepositChange,
    handleAmountPerSecChange,
    disableSubmit,
    isApproving,
    isApproved,
    handleApproval,
    isDark,
  };

  return (
    <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
      {!balancesExist ? <CreateStreamOnly {...formProps} /> : <DepositAndCreate {...formProps} />}
    </form>
  );
};
