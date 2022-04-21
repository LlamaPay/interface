import * as React from 'react';
import BigNumber from 'bignumber.js';
import { checkApproval } from 'components/Form/utils';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import useDepositToken from 'queries/useDepositToken';
import { ITokenBalance } from 'queries/useTokenBalances';

// TODO show loading and error states on dialogs without using toasts
export function useDepositForm({ userAddress, tokens }: { userAddress: string; tokens: ITokenBalance[] }) {
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const {
    mutate: deposit,
    isLoading: confirmingDeposit,
    data: depositTransaction,
    error: depositError,
  } = useDepositToken();

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  // store input amount in a ref to check against token allowance
  const inputAmount = React.useRef('');

  // handle select element change
  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      // don't check for allowance when not required
      if (inputAmount.current !== '') {
        checkApproval({
          tokenDetails: data,
          userAddress,
          approvedForAmount: inputAmount.current,
          checkTokenApproval,
        });
      }
    } else setTokenAddress(token);
  };

  // handle input element change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // don't check for allowance when not required
    if (!checkTokenApproval) return;

    inputAmount.current = e.target.value;

    // find the prop in tokens list, prop is tokenAddress
    const data = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (data) {
      checkApproval({
        tokenDetails: data,
        userAddress,
        approvedForAmount: inputAmount.current,
        checkTokenApproval,
      });
    }
  };

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
        approveToken(
          {
            tokenAddress: tokenAddress,
            amountToApprove: bigAmount.toFixed(0),
            spenderAddress: tokenDetails.llamaContractAddress,
          },
          {
            onSettled: () => {
              checkApproval({
                tokenDetails,
                userAddress,
                approvedForAmount: amountToDeposit,
                checkTokenApproval,
              });
            },
          }
        );
      }
    }
  };

  return {
    checkingApproval,
    approvingToken,
    approvalError,
    confirmingDeposit,
    tokenOptions,
    handleTokenChange,
    handleInputChange,
    handleSubmit,
    tokenAddress,
    setTokenAddress,
    depositTransaction,
    depositError,
    isApproved,
  };
}
