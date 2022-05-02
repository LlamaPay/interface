import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import useDepositToken from 'queries/useDepositToken';
import { useApproveToken, useCheckTokenApproval } from 'queries/useTokenApproval';
import { IFormElements, IFormProps } from './types';
import { checkApproval } from 'components/Form/utils';
import { SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';
import Image from 'next/image';
import AvailableAmount from 'components/AvailableAmount';
import useDepositGnosis from 'queries/useDepositGnosis';
import SDK from '@gnosis.pm/safe-apps-sdk';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import { ERC20Interface, LlamaContractInterface } from 'utils/contract';

const DepositForm = ({ data, formDialog }: IFormProps) => {
  const { mutate, isLoading, data: transaction } = useDepositToken();
  // const { mutate: mutateGnosis } = useDepositGnosis();
  const { sdk } = useSafeAppsSDK();

  const transactionDialog = useDialogState();

  const [{ data: accountData }] = useAccount();

  const [inputAmount, setAmount] = React.useState('');

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  async function depositGnosis(
    transactions: {
      to: string;
      value: string;
      data: string;
    }[]
  ) {
    await sdk.txs.send({ txs: transactions });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);

    checkApproval({
      tokenDetails: {
        decimals: data.tokenDecimals,
        tokenContract: data.tokenContract,
        llamaContractAddress: data.llamaContractAddress,
      },
      userAddress: accountData?.address,
      approvedForAmount: inputAmount,
      checkTokenApproval,
    });
  }

  const fillMaxAmountOnClick = () => {
    if (data.selectedToken && data.selectedToken.balance) {
      setAmount(data.selectedToken.balance);

      checkApproval({
        tokenDetails: {
          decimals: data.tokenDecimals,
          tokenContract: data.tokenContract,
          llamaContractAddress: data.llamaContractAddress,
        },
        userAddress: accountData?.address,
        approvedForAmount: inputAmount,
        checkTokenApproval,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as typeof e.target & IFormElements;
    const amount = form.amount?.value;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(10 ** data.tokenDecimals);
      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        // mutateGnosis({
        //   amountToDeposit: formattedAmt.toFixed(0),
        //   llamaContractAddress: data.llamaContractAddress,
        //   tokenContractAddress: data.tokenAddress,
        // });
        const approve = ERC20Interface.encodeFunctionData('approve', [
          data.llamaContractAddress,
          formattedAmt.toFixed(0),
        ]);
        const deposit = LlamaContractInterface.encodeFunctionData('deposit', [formattedAmt.toFixed(0)]);
        const transactions = [
          {
            to: data.tokenAddress,
            value: '0',
            data: approve,
          },
          {
            to: data.tokenAddress,
            value: '0',
            data: approve,
          },
          // {
          //   to: data.llamaContractAddress,
          //   value: '0',
          //   data: deposit,
          // },
        ];
        depositGnosis(transactions);
      } else if (isApproved) {
        mutate(
          {
            amountToDeposit: formattedAmt.toFixed(0),
            llamaContractAddress: data.llamaContractAddress,
          },
          {
            onSettled: () => {
              formDialog.toggle();
              transactionDialog.toggle();
            },
          }
        );
      } else {
        console.log("isn't approved");
        approveToken(
          {
            tokenAddress: data.tokenAddress,
            amountToApprove: formattedAmt.toFixed(0),
            spenderAddress: data.llamaContractAddress,
          },
          {
            onSettled: () => {
              checkApproval({
                tokenDetails: {
                  decimals: data.tokenDecimals,
                  tokenContract: data.tokenContract,
                  llamaContractAddress: data.llamaContractAddress,
                },
                userAddress: accountData?.address,
                approvedForAmount: amount,
                checkTokenApproval,
              });
            },
          }
        );
      }
    }
  };

  const disableApprove = approvingToken || checkingApproval;

  const Title = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center rounded-full">
          <Image src={data.logoURI} alt={'Logo of ' + data.title} width="24px" height="24px" />
        </div>
        <span>{data.title}</span>
      </div>
    );
  };

  return (
    <>
      <FormDialog title={<Title />} dialog={formDialog} className="h-fit">
        <form className="mt-4 flex flex-col" onSubmit={handleSubmit}>
          <div>
            <div>
              <label className="input-label" htmlFor="tableDFAmountToDeposit">
                Topup Amount
              </label>
              <div className="relative flex">
                <input
                  className="input-field"
                  name="amount"
                  id="tableDFAmountToDeposit"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  type="text"
                  pattern="^[0-9]*[.,]?[0-9]*$"
                  placeholder="0.0"
                  minLength={1}
                  maxLength={79}
                  spellCheck="false"
                  inputMode="decimal"
                  title="Enter numbers only."
                  value={inputAmount}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-[#4E575F] px-2 text-xs font-bold text-[#4E575F] disabled:cursor-not-allowed"
                  disabled={!data}
                  onClick={fillMaxAmountOnClick}
                >
                  MAX
                </button>
              </div>
            </div>
            <AvailableAmount selectedToken={data.selectedToken} title="Available for Deposit" />
          </div>

          <p className="my-4 text-center text-sm text-red-500">{approvalError && "Couldn't approve token"}</p>

          {isApproved ? (
            <SubmitButton disabled={isLoading} className="mt-4">
              {isLoading ? <BeatLoader size={6} color="white" /> : 'Deposit'}
            </SubmitButton>
          ) : (
            <SubmitButton disabled={disableApprove} className="mt-4">
              {disableApprove ? <BeatLoader size={6} color="white" /> : 'Approve on Wallet'}
            </SubmitButton>
          )}
        </form>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};

export default DepositForm;
