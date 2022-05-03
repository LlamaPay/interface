import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import useTokenList from 'hooks/useTokenList';
import { useTranslations } from 'next-intl';
import React from 'react';

import WithdrawOnBehalfForm, { Fallback } from './Form';

export default function WithdrawOnBehalf({ dialog }: { dialog: DisclosureState }) {
  const transactionDialog = useDialogState();

  const { data: tokens, isLoading, error } = useTokenList();

  const [transactionHash, setTransactionHash] = React.useState('');

  const t = useTranslations('Forms');

  return (
    <>
      <FormDialog dialog={dialog} title={t('withdrawOnBehalf')} className="v-min h-min">
        {isLoading ? (
          <Fallback />
        ) : error || !tokens ? (
          <div className="flex h-60 flex-col items-center justify-center">
            <p className="text-sm text-red-500">{t('tokensError')}</p>
          </div>
        ) : (
          <WithdrawOnBehalfForm
            tokens={tokens}
            formDialog={dialog}
            transactionDialog={transactionDialog}
            setTransactionHash={setTransactionHash}
          />
        )}
      </FormDialog>

      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}
