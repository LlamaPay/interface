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
      <button onClick={disperseDialog.toggle} className="secondary-button">
        {` Disperse ${nativeCurrency?.symbol ? nativeCurrency?.symbol : 'Funds'}`}
      </button>
      <FormDialog
        dialog={disperseDialog}
        title={` Disperse ${nativeCurrency?.symbol} to Your Payees`}
        className="v-min h-min"
      >
        <div className="space-y-3">
          {accountData && !unsupported ? (
            <SendToPayees dialog={disperseDialog} />
          ) : (
            <>
              {!accountData ? <p>Connect Wallet</p> : <></>}
              {unsupported ? <p>Unsupported Chain</p> : <></>}
            </>
          )}
        </div>
      </FormDialog>
    </>
  );
}

export default DisperseGasMoney;
