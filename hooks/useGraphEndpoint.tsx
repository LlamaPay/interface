import { useNetwork } from 'wagmi';

interface IUrls {
  [key: number]: string;
}

const urls: IUrls = {
  4: 'https://api.thegraph.com/subgraphs/name/nemusonaneko/llamapay',
  42: 'https://thegraph.com/hosted-service/subgraph/nemusonaneko/llamapay-kovan',
  43113: 'https://thegraph.com/hosted-service/subgraph/nemusonaneko/llamapay-fuji',
};

export const useGraphEndpoint = () => {
  // get users network
  const [{ data }] = useNetwork();

  const chainId: number | null = data?.chain?.id ?? null;

  return chainId ? urls[chainId] : urls[4];
};
