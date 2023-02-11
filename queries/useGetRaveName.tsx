import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { RAVE_RESOLVER } from '~/lib/contracts';
import raveContract from '~/lib/abis/raveContract';
import { networkDetails } from '~/lib/networkDetails';

async function getRaveName(userAddress: string | undefined) {
  try {
    if (!userAddress) throw new Error('No Account');
    const contract = new ethers.Contract(getAddress(RAVE_RESOLVER), raveContract, networkDetails[250].chainProviders);
    return await contract.getName(userAddress, '0');
  } catch (error) {
    return null;
  }
}

export default function useGetRaveName() {
  const [{ data: accountData }] = useAccount();

  return useQuery(['raveName', accountData?.address], () => getRaveName(accountData?.address));
}
