import * as React from 'react';
import { providers } from 'ethers';
import { Connector, Provider, chain, defaultChains } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { WalletLinkConnector } from 'wagmi/connectors/walletLink';

// Get environment variables
const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
const etherscanApiKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';
const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';

// Pick chains
const chains = defaultChains;
const defaultChain = chain.mainnet;

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
  providers.getDefaultProvider(isChainSupported(chainId) ? chainId : defaultChain.id, {
    alchemy: alchemyId,
    etherscan: etherscanApiKey,
    infura: infuraId,
  });
const webSocketProvider = ({ chainId }: ProviderConfig) =>
  isChainSupported(chainId) ? new providers.InfuraWebSocketProvider(chainId, infuraId) : undefined;

type Props = {
  children?: React.ReactNode;
};

export const WalletProvider = ({ children }: Props) => {
  return (
    <Provider autoConnect connectors={connectors} provider={provider} webSocketProvider={webSocketProvider}>
      {children}
    </Provider>
  );
};
