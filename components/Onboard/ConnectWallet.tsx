import * as React from 'react';
import AnimatedStream from '~/components/AnimatedStream';
import { useIsMounted } from '~/hooks';
import { Connector, useAccount, useConnect } from 'wagmi';
import { useTranslations } from 'next-intl';

const ConnectWallet = () => {
  const isMounted = useIsMounted();
  const { connect, connectors, isLoading } = useConnect();

  const { isConnected, isConnecting } = useAccount();

  const handleConnect = React.useCallback(
    async (connector: Connector) => {
      await connect({ connector });
    },
    [connect]
  );

  const hideConnectors = isLoading || isConnecting;

  const t = useTranslations('OnboardWalletConnect');

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
      {!isConnected && <p className="my-7 w-full px-5 text-center text-xs text-lp-gray-6">{t('footer')}</p>}
    </div>
  );
};

export default ConnectWallet;
