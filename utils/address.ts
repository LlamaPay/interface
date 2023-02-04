import { getRaveAddress } from '~/queries/useGetRaveAddress';
import { chainDetails } from './network';
import { ethers } from 'ethers';

export const formatAddress = (address: string) => (address ? `${address.slice(0, 6)}…${address.slice(38, 42)}` : '');

export async function resolveEnsAndRave(domain: string) {
  try {
    const { network: mainnet } = chainDetails('1');
    const ens = await mainnet?.chainProviders.resolveName(domain);
    const rave = await getRaveAddress(domain);
    if (ens || rave) {
      return ens ?? rave;
    } else {
      if (!ethers.utils.isAddress(domain)) {
        return null;
      } else {
        return ethers.utils.getAddress(domain);
      }
    }
  } catch (error) {
    return null;
  }
}
