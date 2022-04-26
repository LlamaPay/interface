import { useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import { useNetworkProvider } from 'hooks';
import useTokenList from 'hooks/useTokenList';
import React from 'react';
import { useAccount } from 'wagmi';
import WithdrawOnBehalfForm, { Fallback } from './Form';

export default function WithdrawOnBehalf() {
  const formDialog = useDialogState();
  const transactionDialog = useDialogState();

  const [{ data: accountData }] = useAccount();
  const { unsupported } = useNetworkProvider();
  const { data: tokens, isLoading, error } = useTokenList();

  const [transactionHash, setTransactionHash] = React.useState('');

  return (
    <>
      <button
        onClick={formDialog.toggle}
        className="secondary-button disabled:cursor-not-allowed"
        disabled={accountData && !unsupported ? false : true}
      >
        Withdraw Another Wallet
      </button>

      <FormDialog dialog={formDialog} title="Withdraw on Behalf of Another Wallet" className="v-min h-min">
        {isLoading ? (
          <Fallback />
        ) : error || !tokens ? (
          <div className="flex h-60 flex-col items-center justify-center">
            <p className="text-sm text-red-500">Couldn't load tokens list</p>
          </div>
        ) : (
          <WithdrawOnBehalfForm
            tokens={tokens}
            formDialog={formDialog}
            transactionDialog={transactionDialog}
            setTransactionHash={setTransactionHash}
          />
        )}
      </FormDialog>

      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}
