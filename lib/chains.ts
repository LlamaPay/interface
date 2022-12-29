import { Chain, allChains } from 'wagmi';

const defaultChains: Chain[] = allChains.filter(
  (chain) =>
    chain.name === 'Avalanche Fuji Testnet' ||
    chain.name === 'Avalanche Mainnet' ||
    chain.name === 'Polygon Mainnet' ||
    chain.name === 'Mainnet' ||
    chain.name === 'Optimism' ||
    chain.name === 'Arbitrum One' ||
    chain.name === 'Goerli'
);

const formattedChains = defaultChains.map((chain) => {
  if (chain.name === 'Mainnet') {
    return { ...chain, name: 'Ethereum' };
  }

  if (chain.name === 'Avalanche Mainnet') {
    return { ...chain, name: 'Avalanche' };
  }

  if (chain.name === 'Polygon Mainnet') {
    return { ...chain, name: 'Polygon' };
  }

  if (chain.name === 'Avalanche Fuji Testnet') {
    return { ...chain, name: 'Fuji' };
  }

  return chain;
});

export const chains: Chain[] = [
  ...formattedChains,
  {
    id: 250,
    name: 'Fantom',
    nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
    rpcUrls: ['https://rpc.ftm.tools'],
    blockExplorers: [
      {
        name: 'FTMScan',
        url: 'https://ftmscan.com',
      },
    ],
  },
  {
    id: 56,
    name: 'BSC',
    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
    rpcUrls: ['https://bsc-dataseed.binance.org'],
    blockExplorers: [
      {
        name: 'BscScan',
        url: 'https://www.bscscan.com/',
      },
    ],
  },
  {
    id: 100,
    name: 'Gnosis',
    nativeCurrency: { name: 'xDAI', symbol: 'xDAI', decimals: 18 },
    rpcUrls: ['https://xdai-rpc.gateway.pokt.network'],
    blockExplorers: [
      {
        name: 'Blockscout',
        url: 'https://blockscout.com/xdai/mainnet/',
      },
    ],
  },
  {
    id: 82,
    name: 'Meter',
    nativeCurrency: { name: 'Meter', symbol: 'MTR', decimals: 18 },
    rpcUrls: ['https://rpc.meter.io'],
    blockExplorers: [
      {
        name: 'Meter Blockchain Explorer',
        url: 'https://scan.meter.io/',
      },
    ],
  },
  {
    id: 2222,
    name: 'Kava',
    nativeCurrency: { name: 'Kava', symbol: 'KAVA', decimals: 18 },
    rpcUrls: ["https://evm.kava.io'"],
    blockExplorers: [
      {
        name: 'Kava Explorer',
        url: 'https://explorer.kava.io/',
      },
    ],
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
