import { useDialogState } from 'ariakit';
import { FormDialog } from 'components/Dialog';
import React from 'react';
import { useAccount } from 'wagmi';
import { useNetworkProvider } from 'hooks';
import SendToPayees from './SendToPayees';

function DisperseGasMoney() {
  const disperseDialog = useDialogState();
  const [{ data: accountData }] = useAccount();
  const { unsupported, nativeCurrency } = useNetworkProvider();

  return (
    <>
      <button
        onClick={disperseDialog.toggle}
        className="secondary-button"
        disabled={accountData && !unsupported ? false : true}
      >
        {` Disperse ${nativeCurrency?.symbol ? nativeCurrency?.symbol : 'Funds'}`}
      </button>
      <FormDialog
        dialog={disperseDialog}
        title={` Disperse ${nativeCurrency?.symbol} to Your Payees`}
        className="v-min h-min"
      >
        <div className="space-y-3">{accountData && !unsupported ? <SendToPayees dialog={disperseDialog} /> : ''}</div>
      </FormDialog>
    </>
  );
}

export default DisperseGasMoney;
