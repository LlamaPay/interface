import { Chain, allChains } from 'wagmi';

export const toHex = (num: number) => {
  return '0x' + num.toString(16);
};

const chains: Chain[] = allChains.filter(
  (chain) => chain.name === 'Rinkeby' || chain.name === 'Kovan' || chain.name === 'Avalanche Fuji Testnet'
);

export default chains;
