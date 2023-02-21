import * as wagmiChains from 'wagmi/chains';

const defaultChains: Array<wagmiChains.Chain> = [
  wagmiChains.mainnet,
  wagmiChains.optimism,
  wagmiChains.arbitrum,
  wagmiChains.polygon,
  wagmiChains.avalanche,
  wagmiChains.fantom,
  wagmiChains.bsc,
  wagmiChains.gnosis,
  wagmiChains.goerli,
  wagmiChains.avalancheFuji,
];

export const chains: Array<wagmiChains.Chain> = [
  ...defaultChains,
  {
    id: 82,
    name: 'Meter',
    network: 'meter',
    nativeCurrency: { name: 'Meter', symbol: 'MTR', decimals: 18 },
    rpcUrls: { default: { http: ['https://rpc.meter.io'] }, public: { http: ['https://rpc.meter.io'] } },
    blockExplorers: {
      default: {
        name: 'Meter Blockchain Explorer',
        url: 'https://scan.meter.io/',
      },
    },
  },
  {
    id: 2222,
    name: 'Kava',
    network: 'kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: { default: { http: ['https://evm.kava.io'] }, public: { http: ['https://evm.kava.io'] } },
    blockExplorers: {
      default: {
        name: 'Kava Explorer',
        url: 'https://explorer.kava.io/',
      },
    },
  },
  // {
  //   id: 1088,
  //   name: 'Metis',
  //   nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
  //   rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
  //   blockExplorers: [
  //     {
  //       name: 'Andromeda Metis Explorer',
  //       url: 'https://andromeda-explorer.metis.io/',
  //     },
  //   ],
  // },
];
