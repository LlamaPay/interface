import * as React from 'react';
import BigNumber from 'bignumber.js';
import { useAccount } from 'wagmi';
import useDepositToken from '~/queries/useDepositToken';
import { useApproveToken, useCheckTokenApproval } from '~/queries/useTokenApproval';
import type { IFormElements, IFormProps } from './types';
import { checkApproval } from '~/components/Form/utils';
import { SubmitButton } from '~/components/Form';
import { BeatLoader } from '~/components/BeatLoader';
import { FormDialog, TransactionDialog } from '~/components/Dialog';
import { useDialogState } from 'ariakit';
import Image from 'next/image';
import AvailableAmount from '~/components/AvailableAmount';
import useDepositGnosis from '~/queries/useDepositGnosis';
import { useTranslations } from 'next-intl';

const DepositForm = ({ data, formDialog }: IFormProps) => {
  const { mutate, isLoading, data: transaction } = useDepositToken();
  const { mutate: mutateGnosis, isLoading: gnosisLoading } = useDepositGnosis();

  const transactionDialog = useDialogState();

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  const { address } = useAccount();

  const [inputAmount, setAmount] = React.useState('');

  // Token approval hooks
  const { mutate: checkTokenApproval, data: isApproved, isLoading: checkingApproval } = useCheckTokenApproval();
  const { mutate: approveToken, isLoading: approvingToken, error: approvalError } = useApproveToken();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAmount(e.target.value);

    checkApproval({
      tokenDetails: {
        decimals: data.tokenDecimals,
        tokenContract: data.tokenContract,
        llamaContractAddress: data.llamaContractAddress,
      },
      userAddress: address,
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
        userAddress: address,
        approvedForAmount: inputAmount,
        checkTokenApproval,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement & IFormElements;
    const amount = form.amount?.value;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(10 ** data.tokenDecimals);

      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        mutateGnosis({
          llamaContractAddress: data.llamaContractAddress,
          tokenContractAddress: data.tokenAddress,
          amountToDeposit: formattedAmt.toFixed(0),
          formDialog: formDialog,
        });
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
                userAddress: address,
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

  const t = useTranslations('Common');

  const Title = () => {
    return (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 flex-shrink-0 items-center rounded-full">
          <Image src={data.logoURI} alt={t('logoAlt', { name: data.title })} width={24} height={24} />
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
                {t1('topupAmount')}
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
                  className="absolute bottom-[5px] top-[10px] right-[5px] rounded-lg border border-lp-gray-1 px-2 text-xs font-bold disabled:cursor-not-allowed dark:border-lp-gray-2"
                  disabled={!data}
                  onClick={fillMaxAmountOnClick}
                >
                  {t1('max')}
                </button>
              </div>
            </div>
            <AvailableAmount selectedToken={data.selectedToken} title={t1('availableForDeposit')} />
          </div>

          <p className="my-4 text-center text-sm text-red-500">{approvalError && "Couldn't approve token"}</p>

          {isApproved ? (
            <SubmitButton disabled={isLoading || gnosisLoading} className="mt-4">
              {isLoading || gnosisLoading ? <BeatLoader size="6px" color="white" /> : t0('deposit')}
            </SubmitButton>
          ) : (
            <SubmitButton disabled={disableApprove} className="mt-4">
              {disableApprove ? <BeatLoader size="6px" color="white" /> : t1('approveOnWallet')}
            </SubmitButton>
          )}
        </form>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};

export default DepositForm;
