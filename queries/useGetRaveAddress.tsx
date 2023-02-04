import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import raveContract from '~/lib/abis/raveContract';
import { RAVE_RESOLVER } from '~/lib/contracts';
import { networkDetails } from '~/lib/networkDetails';

const zero = '0x98FEF8Da2e27984092B00D8d351b1e625B7E0492'.toLowerCase();

export async function getRaveAddress(domain: string) {
  try {
    const rave = new ethers.Contract(getAddress(RAVE_RESOLVER), raveContract, networkDetails[250].chainProviders);
    const owner = await rave.getOwner(domain);
    return owner.toLowerCase() === zero ? null : owner;
  } catch (error) {
    return null;
  }
}
