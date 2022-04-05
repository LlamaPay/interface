import { ethers, providers } from 'ethers';
import { Chain, allChains } from 'wagmi';

export const FACTORY_RINKEBY = '0xf0CCCd4aD7B92d038E80818C8A85d8D926cf8139';
export const FACTORY_KOVAN = '0x5DC88ac35800312CE6186D99FCd7155E88B31fb8';
export const FACTORY_FUJI = '0x3A7d840bAC4127db441FDA2f01A7b693736d1854';

export const infuraId = 'c580a3487b1241a09f9e27b02c004f5b';
export const alchemyId = 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr';
export const etherscanKey = 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q';

interface INetworkDetails {
  [key: number]: {
    rpcUrl: string;
    rpcProvider: ethers.providers.JsonRpcProvider;
    chainProviders: ethers.providers.BaseProvider;
    llamapayFactoryAddress: string;
  };
}

export const defaultProvider = providers.getDefaultProvider(4, {
  alchemy: alchemyId,
  etherscan: etherscanKey,
  infura: infuraId,
});

export const networkDetails: INetworkDetails = {
  4: {
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${infuraId}`),
    chainProviders: providers.getDefaultProvider(4, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_RINKEBY,
  },
  42: {
    rpcUrl: `https://rinkeby.infura.io/v3/${infuraId}`,
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/${infuraId}`),
    chainProviders: providers.getDefaultProvider(42, {
      alchemy: alchemyId,
      etherscan: etherscanKey,
      infura: infuraId,
    }),
    llamapayFactoryAddress: FACTORY_KOVAN,
  },
  43113: {
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    rpcProvider: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    chainProviders: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
    llamapayFactoryAddress: FACTORY_FUJI,
  },
};

export const chains: Chain[] = allChains.filter(
  (chain) => chain.name === 'Rinkeby' || chain.name === 'Kovan' || chain.name === 'Avalanche Fuji Testnet'
);
