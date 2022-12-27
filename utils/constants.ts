import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';
import * as CONTRACTS from 'lib/contracts';

export const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
export const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
export const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    subgraphEndpoint: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress: string;
    disperseAddress: string;
    botAddress: string;
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory: string;
    vestingReason: string;
    paymentsContract?: string;
    paymentsGraphApi?: string;
    botSubgraph?: string;
  };
}

interface ISecondsByDuration {
  [key: string]: number;
}

interface ITokenWhitelist {
  [key: string]: {
    logoURI: string;
    isVerified: boolean;
    name: string;
  };
}

export const defaultProvider = providers.getDefaultProvider(4, {
  alchemy: alchemyId,
  etherscan: etherscanKey,
  infura: infuraId,
});

export const defaultSubgraphEndpoint = 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avax-mainnet';

export const networkDetails: INetworkDetails = {
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fuji',
    chainProviders: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FUJI,
    disperseAddress: '0x267F83942214d11fDce5E8AA98351AFF6392946A',
    botAddress: '',
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FUJI,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  43114: {
    rpcUrl: 'https://rpc.ankr.com/avalanche',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avalanche-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/avalanche'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_AVALANCHE,
    disperseAddress: CONTRACTS.DISPERSE_AVALANCHE,
    botAddress: CONTRACTS.BOT_AVALANCHE,
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    tokenListId: 'avalanche',
    vestingFactory: CONTRACTS.VESTING_FACTORY_AVALANCHE,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-avax',
    paymentsContract: '0x4c48F145e0c80d97bFbc983dd2CbEbEE5d84FA0c',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-avalanche',
  },
  137: {
    rpcUrl: 'https://polygon-rpc.com/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-polygon',
    chainProviders: new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_POLYGON,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_POLYGON,
    blockExplorerURL: 'https://polygonscan.com/',
    blockExplorerName: 'Polygonscan',
    prefix: 'polygon',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    tokenListId: 'polygon-pos',
    vestingFactory: CONTRACTS.VESTING_FACTORY_POLYGON,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: '0x02266E3b5cE26d62Ea73Ea7f2C542EBc24121c01',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-polygon',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-polygon',
  },
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fantom',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_FANTOM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_FANTOM,
    blockExplorerURL: 'https://ftmscan.com/',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: CONTRACTS.VESTING_FACTORY_FANTOM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-fantom',
    paymentsContract: '0xDa33d4B2753B3C2439cA52678E1A506e4C5294d1',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-fantom',
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_MAINNET,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_MAINNET,
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    tokenListId: 'ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY_MAINNET,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-mainnet',
    paymentsContract: '0x056e39bDD2D35F4EB27478369BdAde51e0532b72',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-mainnet',
  },
  10: {
    rpcUrl: 'https://mainnet.optimism.io',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-optimism',
    chainProviders: new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_OPTIMISM,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_OPTIMISM,
    blockExplorerURL: 'https://optimistic.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'optimism',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    tokenListId: 'optimistic-ethereum',
    vestingFactory: CONTRACTS.VESTING_FACTORY_OPTIMISM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-optimism',
    paymentsContract: '0xb4E9D1F7b32937f04B856ec1Ca39AC83E9404779',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-optimism',
  },
  42161: {
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-arbitrum',
    chainProviders: new ethers.providers.JsonRpcProvider('https://arb1.arbitrum.io/rpc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_ARBITRUM,
    disperseAddress: CONTRACTS.DISPERSE_ARBITRUM,
    botAddress: CONTRACTS.BOT_ARBITRUM,
    blockExplorerURL: 'https://arbiscan.io/',
    blockExplorerName: 'Arbiscan',
    prefix: 'arbitrum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    tokenListId: 'arbitrum-one',
    vestingFactory: CONTRACTS.VESTING_FACTORY_ARBITRUM,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: '0x1564d7bFa4bc921A748Aedb3b71E578672528734',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-arbitrum',
  },
  56: {
    rpcUrl: 'https://rpc.ankr.com/bsc',
    subgraphEndpoint: 'https://api.polarsync.app/bsc/defillama/llamapay',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/bsc'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_BSC,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: CONTRACTS.BOT_BSC,
    blockExplorerURL: 'https://www.bscscan.com/',
    blockExplorerName: 'BscScan',
    prefix: 'bsc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    tokenListId: 'binance-smart-chain',
    vestingFactory: CONTRACTS.VESTING_FACTORY_BSC,
    vestingReason: '0x0000000000000000000000000000000000000000',
    paymentsContract: '0x02266E3b5cE26d62Ea73Ea7f2C542EBc24121c01',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-bsc',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-bsc',
  },
  100: {
    rpcUrl: 'https://xdai-rpc.gateway.pokt.network',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-xdai',
    chainProviders: new ethers.providers.JsonRpcProvider('https://xdai-rpc.gateway.pokt.network'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_XDAI,
    disperseAddress: CONTRACTS.DISPERSE_DEFAULT,
    botAddress: '',
    blockExplorerURL: 'https://blockscout.com/xdai/mainnet/',
    blockExplorerName: 'Blockscout',
    prefix: 'xdai',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
    tokenListId: 'xdai',
    vestingFactory: CONTRACTS.VESTING_FACTORY_XDAI,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  82: {
    rpcUrl: 'https://rpc.meter.io',
    subgraphEndpoint: 'https://graph-meter.voltswap.finance/subgraphs/name/nemusonaneko/llamapay-subgraph',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.meter.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METER,
    disperseAddress: CONTRACTS.DISPERSE_METER,
    botAddress: '',
    blockExplorerURL: 'https://scan.meter.io/',
    blockExplorerName: 'Meter Blockchain Explorer',
    prefix: 'meter',
    logoURI: 'https://assets.coingecko.com/coins/images/11848/large/mtrg-logo.png?1595062273',
    tokenListId: 'meter',
    vestingFactory: CONTRACTS.VESTING_FACTORY_METER,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-goerli',
    chainProviders: providers.getDefaultProvider(5, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_GOERLI,
    disperseAddress: CONTRACTS.DISPERSE_GOERLI,
    botAddress: CONTRACTS.BOT_GOERLI,
    blockExplorerURL: 'https://goerli.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_GOERLI,
    vestingReason: '0xA83965c2EBCD3d809f59030D2f7d3c6C646deD3D',
    paymentsContract: '0x02266E3b5cE26d62Ea73Ea7f2C542EBc24121c01',
    paymentsGraphApi: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/token-escrow-goerli',
    botSubgraph: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bot-subgraph-goerli',
  },
  1088: {
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    subgraphEndpoint: 'https://andromeda-graph.metis.io/subgraphs/name/maia-dao/llama-pay',
    chainProviders: new ethers.providers.JsonRpcProvider('https://andromeda.metis.io/?owner=1088'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_METIS,
    disperseAddress: CONTRACTS.DISPERSE_METIS,
    botAddress: '',
    blockExplorerURL: 'https://andromeda-explorer.metis.io/',
    blockExplorerName: 'Andromeda Metis Explorer',
    prefix: 'metis',
    tokenListId: 'metis-andromeda',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_METIS,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
  2222: {
    rpcUrl: 'https://evm.kava.io',
    subgraphEndpoint: 'https://the-graph.kava.io/subgraphs/name/nemusonaneko/llamapay-subgraph/',
    chainProviders: new ethers.providers.JsonRpcProvider('https://evm.kava.io'),
    llamapayFactoryAddress: CONTRACTS.SALARIES_FACTORY_KAVA,
    disperseAddress: CONTRACTS.DISPERSE_KAVA,
    botAddress: '',
    blockExplorerURL: 'https://explorer.kava.io/',
    blockExplorerName: 'Kava Explorer',
    prefix: 'kava',
    tokenListId: 'kava-evm',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/kava/info/logo.png',
    vestingFactory: CONTRACTS.VESTING_FACTORY_KAVA,
    vestingReason: '0x0000000000000000000000000000000000000000',
  },
};

export const defaultChains: Chain[] = allChains.filter(
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

export const secondsByDuration: ISecondsByDuration = {
  hour: 60 * 60,
  day: 24 * 60 * 60,
  week: 7 * 24 * 60 * 60,
  biweek: 2 * 7 * 24 * 60 * 60,
  month: 30 * 24 * 60 * 60,
  year: 365 * 24 * 60 * 60,
};

export const blacklist = ['0x5729cb3716a315d0bde3b5e489163bf8b9659436', '0x6abaedab0ba368f1df52d857f24154cc76c8c972'];
export const whitelist: ITokenWhitelist = {
  '0x687a6294d0d6d63e751a059bf1ca68e4ae7b13e2': {
    logoURI:
      'https://assets.coingecko.com/coins/images/12149/large/Meter-Logo-Vertical-Gray-Light-Blue-rgb-200x200px.png?1597618760',
    name: 'Meter',
    isVerified: true,
  },
};

export const zeroAdd = '0x0000000000000000000000000000000000000000';

export const botDeployedOn: number[] = [43114, 5, 1, 137, 10, 250, 56];

export const timeframes = ['Hour', 'Day', 'Week', 'Month', 'Year'];
