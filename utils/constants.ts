import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

// TESTNETS
export const FACTORY_RINKEBY = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_KOVAN = '0xd43bb75cc924e8475dff2604b962f39089e4f842';
export const FACTORY_FUJI = '0xc4705f96030D347F421Fbe01d9A19F18B26a7d30';
export const FACTORY_GOERLI = '0xcCDd688d7eDcF89bFa217492E247d1395FcEC23D';

export const VESTING_FACTORY_RINKEBY = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_KOVAN = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_FUJI = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_GOERLI = '0x985A0DD877aD2E445e6E7BB58d5600b3F04dDC31';

// LIVE
export const FACTORY_AVALANCHE = '0x7d507b4c2d7e54da5731f643506996da8525f4a3';
export const FACTORY_POLYGON = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_FANTOM = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_MAINNET = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_OPTIMISM = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_ARBITRUM = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_BSC = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_XDAI = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_METER = '0xc666badd040d5e471d2b77296fef46165ffe5132';
export const FACTORY_METIS = '0x43634d1C608f16Fb0f4926c12b54124C93030600';

export const VESTING_FACTORY_AVALANCHE = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_POLYGON = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_FANTOM = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_MAINNET = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_OPTIMISM = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_ARBITRUM = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_BSC = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_XDAI = '0xB93427b83573C8F27a08A909045c3e809610411a';
export const VESTING_FACTORY_METER = '0x6B24Fe659D1E91f8800E86600DE577A4cA8814a6';
export const VESTING_FACTORY_METIS = '0xB93427b83573C8F27a08A909045c3e809610411a';

export const MAINNET_ENS_RESOLVER = '0x3671aE578E63FdF66ad4F3E12CC0c0d71Ac7510C';

export const DISPERSE_DEFAULT = '0xD152f549545093347A162Dce210e7293f1452150';
export const DISPERSE_AVALANCHE = '0x6F9fB43274e9011804Bf516e78CaF5e89856301A';
export const DISPERSE_ARBITRUM = '0x6F9fB43274e9011804Bf516e78CaF5e89856301A';
export const DISPERSE_METER = '0x8e5455983a70da3d1e66719636e907d63eca40b7';
export const DISPERSE_METIS = '0x6F9fB43274e9011804Bf516e78CaF5e89856301A';
export const DISPERSE_GOERLI = '0x6F9fB43274e9011804Bf516e78CaF5e89856301A';
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
    blockExplorerURL: string;
    blockExplorerName: string;
    prefix: string;
    logoURI: string;
    tokenListId?: string;
    vestingFactory: string;
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
  4: {
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-rinkeby',
    chainProviders: providers.getDefaultProvider(4, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_RINKEBY,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://rinkeby.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: VESTING_FACTORY_RINKEBY,
  },
  42: {
    rpcUrl: `https://kovan.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-kovan',
    chainProviders: providers.getDefaultProvider(42, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_KOVAN,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://kovan.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: VESTING_FACTORY_KOVAN,
  },
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fuji',
    chainProviders: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: FACTORY_FUJI,
    disperseAddress: '0x267F83942214d11fDce5E8AA98351AFF6392946A',
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    vestingFactory: VESTING_FACTORY_FUJI,
  },
  43114: {
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avalanche-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc'),
    llamapayFactoryAddress: FACTORY_AVALANCHE,
    disperseAddress: DISPERSE_AVALANCHE,
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
    tokenListId: 'avalanche',
    vestingFactory: VESTING_FACTORY_AVALANCHE,
  },
  137: {
    rpcUrl: 'https://polygon-rpc.com/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-polygon',
    chainProviders: new ethers.providers.JsonRpcProvider('https://polygon-rpc.com/'),
    llamapayFactoryAddress: FACTORY_POLYGON,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://polygonscan.com/',
    blockExplorerName: 'Polygonscan',
    prefix: 'polygon',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',
    tokenListId: 'polygon-pos',
    vestingFactory: VESTING_FACTORY_POLYGON,
  },
  250: {
    rpcUrl: 'https://rpc.ftm.tools/',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fantom',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ftm.tools/'),
    llamapayFactoryAddress: FACTORY_FANTOM,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://ftmscan.com',
    blockExplorerName: 'FTMScan',
    prefix: 'fantom',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/fantom/info/logo.png',
    tokenListId: 'fantom',
    vestingFactory: VESTING_FACTORY_FANTOM,
  },
  1: {
    rpcUrl: 'https://rpc.ankr.com/eth',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth'),
    llamapayFactoryAddress: FACTORY_MAINNET,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    tokenListId: 'ethereum',
    vestingFactory: VESTING_FACTORY_MAINNET,
  },
  10: {
    rpcUrl: 'https://mainnet.optimism.io',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-optimism',
    chainProviders: new ethers.providers.JsonRpcProvider('https://mainnet.optimism.io'),
    llamapayFactoryAddress: FACTORY_OPTIMISM,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://optimistic.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'optimism',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png',
    tokenListId: 'optimistic-ethereum',
    vestingFactory: VESTING_FACTORY_OPTIMISM,
  },
  42161: {
    rpcUrl: 'https://rpc.ankr.com/arbitrum',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-arbitrum',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/arbitrum'),
    llamapayFactoryAddress: FACTORY_ARBITRUM,
    disperseAddress: DISPERSE_ARBITRUM,
    blockExplorerURL: 'https://arbiscan.io/',
    blockExplorerName: 'Arbiscan',
    prefix: 'arbitrum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png',
    tokenListId: 'arbitrum-one',
    vestingFactory: VESTING_FACTORY_ARBITRUM,
  },
  56: {
    rpcUrl: 'https://bsc-dataseed.binance.org',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-bsc',
    chainProviders: new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org'),
    llamapayFactoryAddress: FACTORY_BSC,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://www.bscscan.com/',
    blockExplorerName: 'BscScan',
    prefix: 'bsc',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',
    tokenListId: 'binance-smart-chain',
    vestingFactory: VESTING_FACTORY_BSC,
  },
  100: {
    rpcUrl: 'https://xdai-rpc.gateway.pokt.network',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-xdai',
    chainProviders: new ethers.providers.JsonRpcProvider('https://xdai-rpc.gateway.pokt.network'),
    llamapayFactoryAddress: FACTORY_XDAI,
    disperseAddress: DISPERSE_DEFAULT,
    blockExplorerURL: 'https://blockscout.com/xdai/mainnet/',
    blockExplorerName: 'Blockscout',
    prefix: 'xdai',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/xdai/info/logo.png',
    tokenListId: 'xdai',
    vestingFactory: VESTING_FACTORY_XDAI,
  },
  82: {
    rpcUrl: 'https://rpc.meter.io',
    subgraphEndpoint: 'https://graph.meter.io/subgraphs/name/llamapay/llamapay-meter',
    chainProviders: new ethers.providers.JsonRpcProvider('https://rpc.meter.io'),
    llamapayFactoryAddress: FACTORY_METER,
    disperseAddress: DISPERSE_METER,
    blockExplorerURL: 'https://scan.meter.io/',
    blockExplorerName: 'Meter Blockchain Explorer',
    prefix: 'meter',
    logoURI: 'https://assets.coingecko.com/coins/images/11848/large/mtrg-logo.png?1595062273',
    tokenListId: 'meter',
    vestingFactory: VESTING_FACTORY_METER,
  },
  5: {
    rpcUrl: `https://goerli.infura.io/v3/${infuraId}`,
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-goerli',
    chainProviders: providers.getDefaultProvider(5, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_GOERLI,
    disperseAddress: DISPERSE_GOERLI,
    blockExplorerURL: 'https://goerli.etherscan.io/',
    blockExplorerName: 'Etherscan',
    prefix: 'ethereum',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
    vestingFactory: VESTING_FACTORY_GOERLI,
  },
  1088: {
    rpcUrl: 'https://andromeda.metis.io/?owner=1088',
    subgraphEndpoint: 'https://andromeda-graph.metis.io/subgraphs/name/llamapay/llamapay-metis',
    chainProviders: new ethers.providers.JsonRpcProvider('https://andromeda.metis.io/?owner=1088'),
    llamapayFactoryAddress: FACTORY_METIS,
    disperseAddress: DISPERSE_METIS,
    blockExplorerURL: 'https://andromeda-explorer.metis.io/',
    blockExplorerName: 'Andromeda Metis Explorer',
    prefix: 'metis',
    tokenListId: 'metis-andromeda',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/metis/info/logo.png',
    vestingFactory: VESTING_FACTORY_METIS,
  },
};

export const defaultChains: Chain[] = allChains.filter(
  (chain) =>
    //chain.name === 'Rinkeby' ||
    chain.name === 'Kovan' ||
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
    id: 1088,
    name: 'Metis',
    nativeCurrency: { name: 'Metis', symbol: 'METIS', decimals: 18 },
    rpcUrls: ['https://andromeda.metis.io/?owner=1088'],
    blockExplorers: [
      {
        name: 'Andromeda Metis Explorer',
        url: 'https://andromeda-explorer.metis.io/',
      },
    ],
  },
];

export const secondsByDuration: ISecondsByDuration = {
  week: 7 * 24 * 60 * 60,
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
