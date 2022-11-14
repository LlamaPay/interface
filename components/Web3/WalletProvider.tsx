import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi';
import * as React from 'react';
import { chains, defaultProvider, infuraId, networkDetails } from 'utils/constants';
import { GnosisConnector } from 'utils/GnosisConnector';
import { Connector, Provider } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

const connectors = () => {
  return process.env.NEXT_PUBLIC_SAFE === 'true'
    ? [new SafeConnector({ chains })]
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
  return basicProvider;
};
