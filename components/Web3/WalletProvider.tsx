import * as React from 'react';
import { Connector, Provider, chain } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from 'wagmi/connectors/walletLink';
import chains from 'utils/chains';
import { chainProviders } from 'hooks/useNetworkProvider';

const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';

const defaultChain = chain.rinkeby;

// Set up connectors
type ConnectorsConfig = { chainId?: number };
const connectors = ({ chainId }: ConnectorsConfig) => {
  const rpcUrl = chains.find((x) => x.id === chainId)?.rpcUrls?.[0] ?? defaultChain.rpcUrls[0];
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
    new WalletLinkConnector({
      options: {
        appName: 'LlamaPay',
        jsonRpcUrl: `${rpcUrl}/${infuraId}`,
      },
    }),
  ];
};

// Set up providers
type ProviderConfig = { chainId?: number; connector?: Connector };

const isChainSupported = (chainId?: number) => chains.some((x) => x.id === chainId);

const provider = ({ chainId }: ProviderConfig) =>
  chainId && isChainSupported(chainId) ? chainProviders[chainId] : undefined;

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
