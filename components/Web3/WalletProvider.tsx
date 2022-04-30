import * as React from 'react';
import { chains, defaultProvider, infuraId, networkDetails } from 'utils/constants';
import { Connector, Provider, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';

const defaultChain = chain.avalanche;

// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl = defaultChain.rpcUrls[0];
  const chainDetails = chainId && networkDetails[chainId];

  return [
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
  return (
    <Provider autoConnect connectors={connectors} provider={provider}>
      {children}
    </Provider>
  );
};
