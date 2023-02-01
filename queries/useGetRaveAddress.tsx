import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import raveContract from '~/lib/abis/raveContract';
import { RAVE_RESOLVER } from '~/lib/contracts';
import { networkDetails } from '~/lib/networkDetails';

export async function getRaveAddress(domain: string) {
  try {
    const rave = new ethers.Contract(getAddress(RAVE_RESOLVER), raveContract, networkDetails[250].chainProviders);
    return await rave.getOwner(domain);
  } catch (error) {
    return null;
  }
}
