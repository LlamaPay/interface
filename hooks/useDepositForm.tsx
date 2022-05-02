import * as React from 'react';
import BigNumber from 'bignumber.js';
import { checkApproval } from 'components/Form/utils';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import useDepositToken from 'queries/useDepositToken';
import { ITokenBalance } from 'queries/useTokenBalances';
import { DisclosureState } from 'ariakit';
import useDepositGnosis from 'queries/useDepositGnosis';

// TODO show loading and error states on dialogs without using toasts
// TODO reset form on submit
export function useDepositForm({
  userAddress,
  tokens,
  transactionDialog,
  componentDialog,
}: {
  userAddress: string;
  tokens: ITokenBalance[];
  transactionDialog?: DisclosureState;
  componentDialog?: DisclosureState;
}) {
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');
  const [selectedToken, setSelectedToken] = React.useState<ITokenBalance | null>(tokens[0] || null);
  // store input amount in a ref to check against token allowance
  const [inputAmount, setInputAmount] = React.useState('');

  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  const { mutate: depositGnosis } = useDepositGnosis();

  const {
    mutate: deposit,
    isLoading: confirmingDeposit,
    data: depositTransaction,
    error: depositError,
  } = useDepositToken();

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  // handle select element change
  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      setSelectedToken(data);
      setInputAmount('');
      // don't check for allowance when not required
      if (inputAmount !== '') {
        checkApproval({
          tokenDetails: data,
          userAddress,
          approvedForAmount: inputAmount,
          checkTokenApproval,
        });
      }
    } else setTokenAddress(token);
  };

  // handle input element change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // don't check for allowance when not required
    if (!checkTokenApproval) return;

    setInputAmount(e.target.value);

    // find the prop in tokens list, prop is tokenAddress
    const data = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (data) {
      checkApproval({
        tokenDetails: data,
        userAddress,
        approvedForAmount: inputAmount,
        checkTokenApproval,
      });
    }
  };

  const fillMaxAmountOnClick = () => {
    if (selectedToken?.balance) {
      setInputAmount(selectedToken.balance);

      const data = tokens?.find((t) => t.tokenAddress === tokenAddress);

      if (data) {
        checkApproval({
          tokenDetails: data,
          userAddress,
          approvedForAmount: selectedToken.balance,
          checkTokenApproval,
        });
      }
    }
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // read amountToDeposit from form element
    // make sure it matches the name prop on that element
    const form = e.target as HTMLFormElement & { amountToDeposit: { value: string } };
    const amountToDeposit = form.amountToDeposit?.value;

    // make sure we are setting tokenAddress in the setTokenAddress and not name or symbol
    const tokenDetails = tokens?.find((t) => t.tokenAddress === tokenAddress);

    if (tokenDetails && amountToDeposit) {
      // format amount to bignumber
      const bigAmount = new BigNumber(amountToDeposit).multipliedBy(10 ** tokenDetails?.decimals);

      // call deposit method only if token is approved to spend
      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        depositGnosis({
          llamaContractAddress: tokenDetails.llamaContractAddress,
          tokenContractAddress: tokenDetails.tokenAddress,
          amountToDeposit: bigAmount.toFixed(0),
        });
      } else if (isApproved && tokenDetails.llamaContractAddress) {
        deposit(
          {
            amountToDeposit: bigAmount.toFixed(0),
            llamaContractAddress: tokenDetails.llamaContractAddress,
          },
          {
            onSettled: () => {
              if (transactionDialog && componentDialog) {
                componentDialog.toggle();
                transactionDialog.toggle();
              }
            },
          }
        );
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
    depositTransaction,
    depositError,
    isApproved,
    selectedToken,
    inputAmount,
    fillMaxAmountOnClick,
  };
}
