import * as React from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useIsMounted } from 'hooks';
import { formatAddress } from 'utils/address';
import { Dialog, DialogHeading, DisclosureState } from 'ariakit';
import { XIcon } from '@heroicons/react/solid';

interface Props {
  dialog: DisclosureState;
}

export const WalletSelector = ({ dialog }: Props) => {
  const [{ data: accountData }, disconnect] = useAccount();

  const isMounted = useIsMounted();
  const [
    {
      data: { connectors },
    },
    connect,
  ] = useConnect();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect(connector);
      dialog.toggle();
    },
    [connect, dialog]
  );

  React.useEffect(()=>{
    if(process.env.NEXT_PUBLIC_SAFE === 'true' && typeof window !== 'undefined'){
      connect(connectors[0]);
    }
  }, [])

  const formattedAddress = accountData && formatAddress(accountData.address);

  return (
    <Dialog state={dialog} className="dialog">
      {accountData ? (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span>Account</span>
            <button
              className="absolute top-6 right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeading>
          <div className="mt-3 flex flex-col space-y-2">
            <p className="text-sm font-thin">{`Connected with ${accountData.connector?.name}`}</p>
            <p className="break-words">
              {accountData.ens?.name ? `${accountData.ens?.name} (${formattedAddress})` : accountData.address}
            </p>
            <button
              className="nav-button"
              onClick={() => {
                disconnect();
                dialog.toggle();
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span>Connect a Wallet</span>
            <button
              className="absolute top-6 right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeading>
          <div className="mt-3 flex flex-col space-y-2">
            {connectors.map((x) => (
              <button key={x.id} onClick={() => handleConnect(x)} className="rounded border p-2">
                {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
              </button>
            ))}
          </div>
        </>
      )}
    </Dialog>
  );
};
