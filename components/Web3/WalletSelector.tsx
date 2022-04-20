import * as React from 'react';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useIsMounted } from 'hooks';
import { formatAddress } from 'utils/address';
import { Web3DialogWrapper, Web3DialogHeader, DialogClose } from 'components/Dialog';

interface Props {
  isOpen: boolean;
  setIsOpen: DialogClose;
}

export const WalletSelector = ({ isOpen, setIsOpen }: Props) => {
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
      const { data, error } = await connect(connector);
      setIsOpen(false);
    },
    [connect, setIsOpen]
  );

  const formattedAddress = accountData && formatAddress(accountData.address);

  return (
    <Web3DialogWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      {accountData ? (
        <>
          <Web3DialogHeader title="Account" setIsOpen={setIsOpen} />
          <div className="mt-3 flex flex-col space-y-2">
            <p className="text-sm font-thin">{`Connected with ${accountData.connector?.name}`}</p>
            <p className="break-words">
              {accountData.ens?.name ? `${accountData.ens?.name} (${formattedAddress})` : accountData.address}
            </p>
            <button
              className="nav-button"
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            >
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <>
          <Web3DialogHeader title="Connect a Wallet" setIsOpen={setIsOpen} />
          <div className="mt-3 flex flex-col space-y-2">
            {connectors.map((x) => (
              <button key={x.id} onClick={() => handleConnect(x)} className="rounded border p-2">
                {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
              </button>
            ))}
          </div>
        </>
      )}
    </Web3DialogWrapper>
  );
};
