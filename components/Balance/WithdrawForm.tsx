import * as React from 'react';
import BigNumber from 'bignumber.js';
import useWithdrawByPayer from 'queries/useWithdrawTokenByPayer';
import { IFormElements, IFormProps } from './types';
import { InputAmount, SubmitButton } from 'components/Form';
import { BeatLoader } from 'react-spinners';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useDialogState } from 'ariakit';
import AvailableAmount from 'components/AvailableAmount';
import { useTranslations } from 'next-intl';
import useGnosisBatch from 'queries/useGnosisBatch';
import { LlamaContractInterface } from 'utils/contract';

const WithdrawForm = ({ data, formDialog }: IFormProps) => {
  const { mutate, isLoading, data: transaction } = useWithdrawByPayer();
  const { mutate: gnosisBatch } = useGnosisBatch();
  const transactionDialog = useDialogState();

  const withdrawAll = React.useRef(false);

  const t0 = useTranslations('Common');
  const t1 = useTranslations('Forms');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement & IFormElements;
    const amount = form.amount.value;

    if (amount) {
      const formattedAmt = new BigNumber(amount).multipliedBy(1e20);
      if (process.env.NEXT_PUBLIC_SAFE === 'true') {
        const call: { [key: string]: string[] } = {};
        call[data.llamaContractAddress] = [
          LlamaContractInterface.encodeFunctionData('withdrawPayer', [formattedAmt.toFixed(0)]),
        ];
        gnosisBatch({ calls: call });
      } else {
        withdrawAll.current = false;
        mutate(
          {
            amountToWithdraw: formattedAmt.toFixed(0),
            llamaContractAddress: data.llamaContractAddress,
            withdrawAll: false,
          },
          {
            onSettled: () => {
              formDialog.toggle();
              transactionDialog.toggle();
            },
          }
        );
      }
    }

    form.reset();
  };

  const withdrawAllTokens = () => {
    if (process.env.NEXT_PUBLIC_SAFE === 'true') {
      const call: { [key: string]: string[] } = {};
      call[data.llamaContractAddress] = [LlamaContractInterface.encodeFunctionData('withdrawPayerAll')];
      gnosisBatch({ calls: call });
    } else {
      withdrawAll.current = true;
      mutate(
        {
          llamaContractAddress: data.llamaContractAddress,
          withdrawAll: true,
        },
        {
          onSettled: () => {
            formDialog.toggle();
            transactionDialog.toggle();
          },
        }
      );
    }
  };

  return (
    <>
      <FormDialog title={data.title} dialog={formDialog} className="h-fit">
        <form className="mt-4 flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <InputAmount name="amount" label={`${t0('amount')} ${data.symbol}`} isRequired />
            <AvailableAmount
              title={t1('availableForWithdrawl')}
              selectedToken={data.selectedToken}
              amount={data.userBalance}
            />
          </div>
          <SubmitButton disabled={isLoading}>
            {isLoading && !withdrawAll.current ? <BeatLoader size={6} color="white" /> : t0('withdraw')}
          </SubmitButton>
        </form>
        <p className="my-3 text-center font-light text-lp-gray-1">{t0('or')}</p>
        <SubmitButton
          disabled={isLoading}
          onClick={withdrawAllTokens}
          className="bg-lp-white text-lp-primary dark:border-transparent dark:bg-lp-gray-5 dark:text-lp-white"
        >
          {isLoading && withdrawAll.current ? <BeatLoader size={6} color="gray" /> : t1('withdrawAll')}
        </SubmitButton>
      </FormDialog>
      {transaction && <TransactionDialog dialog={transactionDialog} transactionHash={transaction.hash || ''} />}
    </>
  );
};

export default WithdrawForm;
