import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

// FACTORIES
export const FACTORY_RINKEBY = '0xde1C04855c2828431ba637675B6929A684f84C7F';
export const FACTORY_KOVAN = '0x1986317FBEDF12160A8690717202ca15233ecD4A';
export const FACTORY_FUJI = '0xc4705f96030D347F421Fbe01d9A19F18B26a7d30';
export const FACTORY_AVALANCHE = '0xc4705f96030D347F421Fbe01d9A19F18B26a7d30';
export const FACTORY_POLYGON = '0xde1C04855c2828431ba637675B6929A684f84C7F';

export const DISPERSE_DEFAULT = '0xD152f549545093347A162Dce210e7293f1452150';
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
  },
  43114: {
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-avalanche-mainnet',
    chainProviders: new ethers.providers.JsonRpcProvider('https://api.avax.network/ext/bc/C/rpc'),
    llamapayFactoryAddress: FACTORY_AVALANCHE,
    disperseAddress: '0x6F9fB43274e9011804Bf516e78CaF5e89856301A',
    blockExplorerURL: 'https://snowtrace.io/',
    blockExplorerName: 'Snowtrace',
    prefix: 'avax',
    logoURI: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchex/info/logo.png',
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
  },
};

export const chains: Chain[] = allChains.filter(
  (chain) =>
    chain.name === 'Rinkeby' ||
    chain.name === 'Kovan' ||
    chain.name === 'Avalanche Fuji Testnet' ||
    chain.name === 'Avalanche Mainnet' ||
    chain.name === 'Polygon'
);

export const secondsByDuration = {
  month: 2592000,
  year: 31104000,
};
