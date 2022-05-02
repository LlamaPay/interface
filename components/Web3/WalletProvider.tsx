import * as React from 'react';
import { chains, defaultProvider, infuraId, networkDetails } from 'utils/constants';
import { GnosisConnector } from 'utils/GnosisConnector';
import { Connector, Provider, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import SafeProvider from '@gnosis.pm/safe-apps-react-sdk';

const defaultChain = chain.avalanche;

// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl = defaultChain.rpcUrls[0];
  const chainDetails = chainId && networkDetails[chainId];

  return process.env.NEXT_PUBLIC_SAFE === 'true'
    ? [
        new GnosisConnector({
          chains,
        }),
      ]
    : [
        new InjectedConnector({
          chains,
          options: { shimDisconnect: true },
        }),
        new WalletConnectConnector({
          options: {
            infuraId,
            qrcode: true,
          },
        }),
        new CoinbaseWalletConnector({
          options: {
            appName: 'LlamaPay',
            jsonRpcUrl: chainDetails ? chainDetails.rpcUrl : `${rpcUrl}/${infuraId}`,
          },
        }),
      ];
};

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector };

const provider = ({ chainId }: ProviderConfig) => {
  const chainDetails = chainId && networkDetails[chainId];
  return chainDetails ? chainDetails.chainProviders : defaultProvider;
};

type Props = {
  children?: React.ReactNode;
};

export const WalletProvider = ({ children }: Props) => {
  const basicProvider = (
    <Provider autoConnect connectors={connectors} provider={provider}>
      {children}
    </Provider>
  );
  const SafeContextProvider = SafeProvider as any
  return process.env.NEXT_PUBLIC_SAFE === 'true' && typeof window !== "undefined" ? (
    <SafeContextProvider>{basicProvider}</SafeContextProvider>
  ) : (
    basicProvider
  );
};
