import * as React from 'react';
import BigNumber from 'bignumber.js';
import {
  InputAmountWithDuration,
  InputAmountWithMaxButton,
  InputText,
  SelectToken,
  SubmitButton,
} from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IFormElements, IStreamFormProps } from './types';
import { secondsByDuration } from 'utils/constants';
import { checkApproval } from 'components/Form/utils';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from 'components/Dialog';
import AvailableAmount from 'components/AvailableAmount';
import { ITokenBalance } from 'queries/useTokenBalances';

const DepositAndCreate = ({ tokens, userAddress, dialog }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading: confirmingStream, data: transactionDetails } = useStreamToken();

  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');
  const [selectedToken, setSelectedToken] = React.useState<ITokenBalance | null>(tokens[0] || null);

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

  // format tokens list to only include token names
  const tokenOptions = React.useMemo(() => tokens?.map((t) => t.tokenAddress) ?? [], [tokens]);

  // store input amount in a ref to check against token allowance
  const [inputAmount, setInputAmount] = React.useState('');

  // handle select element change
  const handleTokenChange = (token: string) => {
    // find the prop in tokens list, prop is the one used to format in tokenOptions above
    const data = tokens?.find((t) => t.tokenAddress === token);

    if (data) {
      setTokenAddress(data.tokenAddress);
      setSelectedToken(data);
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
          approvedForAmount: inputAmount,
          checkTokenApproval,
        });
      }
    }
  };

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IFormElements;

    const amountToDeposit = form.amountToDeposit?.value;
    const amountToStream = form.amountToStream?.value;
    const streamDuration = form.streamDuration?.value;
    const payeeAddress = form.addressToStream?.value;

    const duration = streamDuration;

    if (tokenAddress !== '') {
      // check if token exist in all tokens list
      const tokenDetails = tokens.find((t) => t.tokenAddress === tokenAddress) ?? null;

      if (tokenDetails) {
        // format amounts to bignumbers
        // convert amt to seconds
        const amtPerSec = new BigNumber(amountToStream).times(1e20).div(secondsByDuration[duration]);

        const amtToDeposit = new BigNumber(amountToDeposit).times(10 ** tokenDetails.decimals);

        // query mutation for depositAndCreate method
        if (isApproved) {
          streamToken(
            {
              method: 'DEPOSIT_AND_CREATE',
              amountPerSec: amtPerSec.toFixed(0),
              amountToDeposit: amtToDeposit.toFixed(0),
              payeeAddress: payeeAddress,
              llamaContractAddress: tokenDetails?.llamaContractAddress,
            },
            {
              onSuccess: () => {
                dialog.toggle();
              },
            }
          );
        } else {
          approveToken(
            {
              tokenAddress: tokenAddress,
              spenderAddress: tokenDetails.llamaContractAddress,
              amountToApprove: amtToDeposit.toFixed(0), // approve for amount to deposit
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
    }
  };

  const disableApprove = checkingApproval || approvingToken;

  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div>
          <SelectToken
            label="What token do you want to Deposit and Create a Stream?"
            tokens={tokenOptions}
            handleTokenChange={handleTokenChange}
            tokenBalanceOf="wallet"
          />
          <AvailableAmount selectedToken={selectedToken} title="Available for Deposit" />
        </div>

        <InputAmountWithMaxButton
          inputAmount={inputAmount}
          handleInputChange={handleInputChange}
          fillMaxAmountOnClick={fillMaxAmountOnClick}
          selectedToken={selectedToken}
          id="bdAmountToDeposit"
        />

        <InputText
          name="addressToStream"
          isRequired={true}
          label="Enter an Address to Stream"
          placeholder="Enter Recipient Address"
        />

        <InputAmountWithDuration
          name="amountToStream"
          isRequired={true}
          label="Amount to Stream"
          selectInputName="streamDuration"
        />

        {isApproved ? (
          <SubmitButton disabled={confirmingStream} className="mt-4">
            {confirmingStream ? <BeatLoader size={6} color="white" /> : 'Deposit and Create Stream'}
          </SubmitButton>
        ) : (
          <SubmitButton disabled={disableApprove} className="mt-4">
            {disableApprove ? <BeatLoader size={6} color="white" /> : 'Approve'}
          </SubmitButton>
        )}
      </form>
      <TransactionDialog dialog={dialog} transactionHash={transactionDetails?.hash ?? ''} />
    </>
  );
};

export default DepositAndCreate;
