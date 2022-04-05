import { ethers, providers } from 'ethers';
import { useNetwork } from 'wagmi';
export type Provider = ethers.providers.BaseProvider;

interface IUrls {
  [key: number]: Provider;
}

const chainProvider = (id: number) =>
  providers.getDefaultProvider(id, {
    alchemy: 'PwvZx2hO2XpToWXSw9sgJJt1eBgjkRUr',
    etherscan: 'DDH7EVWI1AQHBNPX5PYRSDM5SHCVBKX58Q',
    infura: 'c580a3487b1241a09f9e27b02c004f5b',
  });

export const chainProviders: any = {
  4: chainProvider(4),
  42: chainProvider(42),
  43113: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
};

const rpcUrls: IUrls = {
  4: new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/c580a3487b1241a09f9e27b02c004f5b`),
  42: new ethers.providers.JsonRpcProvider(`https://kovan.infura.io/v3/c580a3487b1241a09f9e27b02c004f5b`),
  43113: new ethers.providers.JsonRpcProvider(`https://api.avax-test.network/ext/bc/C/rpc`),
};

export const useNetworkProvider = () => {
  const [{ data }] = useNetwork();

  const chainId = data?.chain?.id ?? null;
  const name: string | null = data?.chain?.name ?? null;

  return { provider: chainId ? rpcUrls[chainId] : rpcUrls[4], network: name || '' };
};
