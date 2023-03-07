import * as React from 'react';
import { networkDetails } from '~/lib/networkDetails';
import { chains as wagmiChains } from '~/lib/chains';
import { configureChains, Connector, createClient, WagmiConfig } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { SafeConnector } from 'wagmi/connectors/safe';

const { chains, provider } = configureChains(
  [...wagmiChains],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === 1) {
          return { http: networkDetails[1].rpcUrl };
        } else if (chain.id === 5) {
          return { http: networkDetails[5].rpcUrl };
        } else return { http: chain.rpcUrls.default.http[0] };
      },
    }),
  ]
);

const connectors: Array<Connector> = [
  new InjectedConnector({
    chains,
    options: { shimDisconnect: true },
  }),
  new WalletConnectConnector({
    options: {
      qrcode: true,
    },
  }),
];

if (process.env.NEXT_PUBLIC_SAFE === 'true') {
  connectors.push(
    new SafeConnector({
      chains,
      // options: { allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /safe.llamapay.io$/] },
    })
  );
}
const wagmiClient = createClient({
  autoConnect: process.env.NEXT_PUBLIC_SAFE === 'true' ? true : true,
  connectors,
  provider,
});

type Props = {
  children?: React.ReactNode;
};

export const WalletProvider = ({ children }: Props) => <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
