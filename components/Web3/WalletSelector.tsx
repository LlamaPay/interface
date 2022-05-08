import * as React from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useIsMounted } from 'hooks';
import { formatAddress } from 'utils/address';
import { Dialog, DialogHeading, DisclosureState } from 'ariakit';
import { XIcon } from '@heroicons/react/solid';
import { useTranslations } from 'next-intl';

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

  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_SAFE === 'true' && typeof window !== 'undefined') {
      connect(connectors[0]);
    }
  }, [connect, connectors]);

  const formattedAddress = accountData && formatAddress(accountData.address);

  const t = useTranslations('Common');

  return (
    <Dialog state={dialog} className="dialog">
      {accountData ? (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span>{t('account')}</span>
            <button
              className="absolute top-[18px] right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">{t('close')}</span>
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeading>
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-sm font-thin">{`${t('connectedWith')} ${accountData.connector?.name}`}</p>
            <p className="break-words">
              {accountData.ens?.name ? `${accountData.ens?.name} (${formattedAddress})` : accountData.address}
            </p>
            <button
              className="nav-button mt-5 dark:border-[#23BD8F] dark:bg-[#23BD8F] dark:text-white"
              onClick={() => {
                disconnect();
                dialog.toggle();
              }}
            >
              {t('disconnect')}
            </button>
          </div>
        </>
      ) : (
        <>
          <DialogHeading className="text-base font-medium leading-6 text-neutral-700 dark:text-neutral-200">
            <span>{t('connectWallet')}</span>
            <button
              className="absolute top-[18px] right-4 rounded hover:bg-neutral-200 dark:hover:bg-zinc-800"
              onClick={dialog.toggle}
            >
              <span className="sr-only">{t('close')}</span>
              <XIcon className="h-5 w-5" />
            </button>
          </DialogHeading>
          <div className="mt-3 flex flex-col gap-2">
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
