import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputAmountWithDuration, InputText, InputWithTokenSelect, SubmitButton } from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IFormElements, IStreamFormProps } from './types';
import { secondsByDuration } from 'utils/constants';
import { checkApproval } from 'components/Form/utils';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from 'components/Dialog';

const DepositAndCreate = ({ tokens, userAddress, dialog }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading: confirmingStream, data: transactionDetails } = useStreamToken();

  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

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

  // create stream on submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as typeof e.target & IFormElements;

    const amountToDeposit = form.amountToDeposit?.value;
    const amountToStream = form.amountToStream?.value;
    const streamDuration = form.streamDuration?.value;
    const payeeAddress = form.addressToStream?.value;

    const duration = streamDuration === 'year' ? 'year' : 'month';

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
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <InputWithTokenSelect
          name="amountToDeposit"
          label="Deposit"
          handleTokenChange={handleTokenChange}
          handleInputChange={handleInputChange}
          tokenOptions={tokenOptions}
          isRequired
        />

        <InputText name="addressToStream" isRequired={true} label="Address to stream" />

        <InputAmountWithDuration
          name="amountToStream"
          isRequired={true}
          label="Amount to stream"
          selectInputName="streamDuration"
        />

        {isApproved ? (
          <SubmitButton disabled={confirmingStream} className="mt-8">
            {confirmingStream ? <BeatLoader size={6} color="gray" /> : 'Deposit and Create Stream'}
          </SubmitButton>
        ) : (
          <SubmitButton disabled={disableApprove} className="mt-4">
            {disableApprove ? <BeatLoader size={6} color="gray" /> : 'Approve'}
          </SubmitButton>
        )}
      </form>
      <TransactionDialog dialog={dialog} transactionHash={transactionDetails?.hash ?? ''} />
    </>
  );
};

export default DepositAndCreate;
