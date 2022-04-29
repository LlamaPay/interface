import { allChains } from 'wagmi';
import { networkDetails } from './constants';

export function chainDetails(chainId: unknown) {
  const id = typeof chainId === 'string' ? Number(chainId) : 0;

  const network = networkDetails[id];
  const chain = allChains.find((c) => c.id === id);

  return { network, chain };
}
