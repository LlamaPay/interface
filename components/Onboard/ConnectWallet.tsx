import * as React from 'react';
import AnimatedStream from 'components/AnimatedStream';
import { useIsMounted } from 'hooks';
import { Connector, useAccount, useConnect } from 'wagmi';

const ConnectWallet = () => {
  const isMounted = useIsMounted();
  const [
    {
      data: { connectors },
      loading: connecting,
    },
    connect,
  ] = useConnect();

  const [{ data: accountData, loading: accountDataLoading }] = useAccount();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect(connector);
    },
    [connect]
  );

  const hideConnectors = connecting || accountDataLoading;

  return (
    <div className="mt-12 flex flex-1 flex-col overflow-auto sm:mt-[104px]">
      <main className="mx-auto flex w-full flex-1 flex-col gap-4 px-7 sm:max-w-[26rem]">
        {hideConnectors ? (
          <AnimatedStream />
        ) : (
          <>
            {connectors.map((x) => (
              <button
                key={x.id}
                onClick={() => handleConnect(x)}
                className="mt-8 w-full rounded-xl border border-[#CDCDCD] bg-white p-2 py-4 font-bold text-[#4E575F] first-of-type:mt-0"
              >
                {isMounted ? x.name : x.id === 'injected' ? x.id : x.name}
              </button>
            ))}
          </>
        )}
      </main>
      {!accountData && (
        <p className="my-7 w-full px-5 text-center text-xs text-[#303030]">Connecting a wallet doesn't move funds</p>
      )}
    </div>
  );
};

export default ConnectWallet;
