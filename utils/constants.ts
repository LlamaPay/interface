import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

export const FACTORY_RINKEBY = '0xEDF04002c8bDab6AdC2BD738F4e84953bb38c481';
export const FACTORY_KOVAN = '0x7AaCc52c41DA1Ac634f1e0F1dbefFB593Bc64503';
export const FACTORY_FUJI = '0xf0CCCd4aD7B92d038E80818C8A85d8D926cf8139';

export const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
export const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
export const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    rpcProvider: ethers.providers.JsonRpcProvider;
    subgraphEndpoint: string;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress: string;
    blockExplorerURL: string;
    blockExplorerName: string;
  };
}

export const defaultProvider = providers.getDefaultProvider(4, {
  alchemy: alchemyId,
  etherscan: etherscanKey,
  infura: infuraId,
});

export const defaultSubgraphEndpoint = 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-rinkeby';

export const networkDetails: INetworkDetails = {
  4: {
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infuraId}`),
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-rinkeby',
    chainProviders: providers.getDefaultProvider(4, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_RINKEBY,
    blockExplorerURL: 'https://rinkeby.etherscan.io/',
    blockExplorerName: 'Etherscan',
  },
  42: {
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraId}`),
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-kovan',
    chainProviders: providers.getDefaultProvider(42, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_KOVAN,
    blockExplorerURL: 'https://kovan.etherscan.io/',
    blockExplorerName: 'Etherscan',
  },
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    subgraphEndpoint: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay-fuji',
    chainProviders: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: FACTORY_FUJI,
    blockExplorerURL: 'https://testnet.snowtrace.io/',
    blockExplorerName: 'Snowtrace',
  },
};

export const chains: Chain[] = allChains.filter(
  (chain) => chain.name === 'Rinkeby' || chain.name === 'Kovan' || chain.name === 'Avalanche Fuji Testnet'
);

export const secondsByDuration = {
  month: 2592000,
  year: 31104000,
};
