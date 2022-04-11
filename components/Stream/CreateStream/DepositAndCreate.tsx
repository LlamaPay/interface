import * as React from 'react';
import BigNumber from 'bignumber.js';
import { InputAmountWithDuration, InputText, InputWithTokenSelect, SubmitButton } from 'components/Form';
import useStreamToken from 'queries/useStreamToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IStreamFormProps, IFormElements } from './types';
import { secondsByDuration } from 'utils/constants';
import { checkApproval } from 'components/Form/utils';
import { useAccount } from 'wagmi';
import { BeatLoader } from 'react-spinners';
import { TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';

const DepositAndCreate = ({ tokens }: IStreamFormProps) => {
  const { mutate: streamToken, isLoading, data: transaction } = useStreamToken();
  const [{ data: accountData }] = useAccount();

  // store address of the token to stream as ariakit/select is a controlled component
  const [tokenAddress, setTokenAddress] = React.useState(tokens[0]?.tokenAddress ?? '');

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();

  const { mutate: approveToken, isLoading: approvingToken } = useApproveToken();

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

        // query mutation

        if (isApproved) {
          streamToken({
            method: 'DEPOSIT_AND_CREATE',
            amountPerSec: amtPerSec.toFixed(0),
            amountToDeposit: amtToDeposit.toFixed(0),
            payeeAddress: payeeAddress,
            llamaContractAddress: tokenDetails?.llamaContractAddress,
          });
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
                  userAddress: accountData?.address,
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

  const dialog = useDialogState();

  const disableApprove = checkingApproval || approvingToken;

  return (
    <>
      <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
        <InputWithTokenSelect
          name="amountToDeposit"
          label="Deposit"
          tokenAddress={tokenAddress}
          setTokenAddress={setTokenAddress}
          checkTokenApproval={checkTokenApproval}
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
          <SubmitButton disabled={isLoading} className="mt-8">
            {isLoading ? <BeatLoader size={6} color="gray" /> : 'Deposit and Create Stream'}
          </SubmitButton>
        ) : (
          <SubmitButton disabled={disableApprove} className="mt-4">
            {disableApprove ? <BeatLoader size={6} color="gray" /> : 'Approve'}
          </SubmitButton>
        )}
      </form>
      <TransactionDialog dialog={dialog} transactionHash={transaction?.hash ?? ''} />
    </>
  );
};

export default DepositAndCreate;
