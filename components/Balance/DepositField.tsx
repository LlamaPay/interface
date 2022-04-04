import * as React from 'react';
import { InputWithToken, SubmitButton } from 'components/Form';
import useGetAllTokens from 'queries/useGetAllTokens';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import useDepositToken from 'queries/useDepositToken';
import { useAccount } from 'wagmi';
import BigNumber from 'bignumber.js';
import { checkIsAmountValid } from 'components/Stream/utils';
import { ICheckApproval } from './types';

const DepositField = () => {
  // TODO handle loading and error states
  const { data: tokens, isLoading: tokensLoading, error: tokensError } = useGetAllTokens();

  const { mutate: deposit, isLoading } = useDepositToken();
  const [{ data: accountData }] = useAccount();

  const [tokenAddress, setTokenAddress] = React.useState('');
  const amountToDeposit = React.useRef('');

  // function to check if a token is approved
  // TODO implement debounce
  function checkApproval({ tokenAddress, userAddress, approvedForAmount }: ICheckApproval) {
    if (tokenAddress && userAddress) {
      const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress) ?? null;
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

  // Token approval hooks
  // TODO handle loading and error states, also check if transaction is succesfull on chain, until then disable button and show loading state
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval, error } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.name), [tokens]);

  // Handle changes in form
  const handleTokenChange = (token: string) => {
    const data = tokens?.find((t) => t.name === token);
    if (data) {
      setTokenAddress(data.tokenAddress);
      checkApproval({
        tokenAddress: data.tokenAddress,
        userAddress: accountData?.address,
        approvedForAmount: amountToDeposit.current,
      });
    } else setTokenAddress(token);
  };

  const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    amountToDeposit.current = e.target.value;
    checkApproval({
      tokenAddress: tokenAddress,
      userAddress: accountData?.address,
      approvedForAmount: amountToDeposit.current,
    });
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (checkIsAmountValid(amountToDeposit.current) && tokenDetails) {
      const bigAmount = new BigNumber(amountToDeposit.current).multipliedBy(10 ** tokenDetails?.decimals);

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

  if (!tokenOptions) return null;

  const disableApprove = checkingApproval || approvingToken;

  return (
    <form onSubmit={handleSubmit} className="my-4">
      <InputWithToken
        name="amountToDeposit"
        handleChange={handleDepositChange}
        handleTokenChange={handleTokenChange}
        tokens={tokenOptions}
        isRequired={true}
        className="pr-[32%]"
        label="Deposit"
      />
      {isApproved ? (
        <SubmitButton disabled={isLoading} className="mt-4">
          {isLoading ? '...' : 'Deposit'}
        </SubmitButton>
      ) : (
        <SubmitButton disabled={disableApprove} className="mt-4">
          {disableApprove ? '...' : 'Approve'}
        </SubmitButton>
      )}
    </form>
  );
};

export default DepositField;
