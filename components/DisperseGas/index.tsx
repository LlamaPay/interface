import { DisclosureState, useDialogState } from 'ariakit';
import { FormDialog, TransactionDialog } from 'components/Dialog';
import React from 'react';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import SendToPayees from './SendToPayees';

function DisperseGasMoney({ dialog }: { dialog: DisclosureState }) {
  const [{ data: accountData }] = useAccount();
  const { unsupported, nativeCurrency } = useNetworkProvider();
  const transactionDialog = useDialogState();
  const [transactionHash, setTransactionHash] = React.useState<string>('');

  return (
    <>
      <FormDialog dialog={dialog} title={` Disperse ${nativeCurrency?.symbol} to Your Payees`} className="v-min h-min">
        <div className="space-y-3">
          {accountData && !unsupported ? (
            <SendToPayees
              dialog={dialog}
              setTransactionHash={setTransactionHash}
              transactionDialog={transactionDialog}
            />
          ) : (
            ''
          )}
        </div>
      </FormDialog>
      <TransactionDialog dialog={transactionDialog} transactionHash={transactionHash} />
    </>
  );
}

export default DisperseGasMoney;
