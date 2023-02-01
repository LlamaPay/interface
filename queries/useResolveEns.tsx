import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from '~/hooks';
import { useQuery } from 'react-query';
import { StreamAndHistoryQuery } from '~/services/generated/graphql';
import { networkDetails } from '~/lib/networkDetails';
import { mainnetResolverABI } from '~/lib/abis/mainnetResolver';
import { chainDetails } from '~/utils/network';
import { MAINNET_ENS_RESOLVER, RAVE_RESOLVER } from '~/lib/contracts';
import raveContract from '~/lib/abis/raveContract';

export interface IEnsResolve {
  [key: string]: string | null;
}

const mainnetProvider = networkDetails[1].chainProviders;

async function resolveEns(data: StreamAndHistoryQuery | undefined, address: string | undefined) {
  try {
    if (!data) {
      throw new Error('No stream and history data');
    } else if (!address) {
      throw new Error('No Address');
    } else {
      const contract = new ethers.Contract(getAddress(MAINNET_ENS_RESOLVER), mainnetResolverABI, mainnetProvider);
      const rave = new ethers.Contract(getAddress(RAVE_RESOLVER), raveContract, networkDetails[250].chainProviders);

      const streams = data?.user?.streams ?? [];
      const history = data?.user?.historicalEvents ?? [];

      const queryAddresses: string[] = [];

      streams.map((s) => {
        if (!queryAddresses.includes(s.payer.id.toLowerCase())) {
          queryAddresses.push(s.payer.id.toLowerCase());
        }
        if (!queryAddresses.includes(s.payee.id.toLowerCase())) {
          queryAddresses.push(s.payee.id.toLowerCase());
        }
      });

      history.map((h) => {
        const addressRelated =
          h.stream?.payer?.id?.toLowerCase() === address.toLowerCase()
            ? h.stream?.payee?.id?.toLowerCase()
            : h.stream?.payer?.id?.toLowerCase();

        if (addressRelated && !queryAddresses.includes(addressRelated)) {
          queryAddresses.push(addressRelated);
        }
      });

      const resolveCall = await contract.getNames(queryAddresses);

      const raveCalls = [];
      for (let i = 0; i < queryAddresses.length; i++) {
        const resolved = await rave.getName(queryAddresses[i], '0');
        raveCalls.push(resolved);
      }

      const resolvedAddresses: IEnsResolve = {};

      for (let i = 0; i < resolveCall.length; i++) {
        if (raveCalls[i] !== '') {
          resolvedAddresses[queryAddresses[i]] = raveCalls[i];
        }
        if (resolveCall[i] !== '') {
          resolvedAddresses[queryAddresses[i]] = resolveCall[i];
        }
      }
      return resolvedAddresses;
    }
  } catch (error) {
    return null;
  }
}

const { network: mainnet } = chainDetails('1');

async function fetchEns(address: string) {
  const userAddress = await mainnet?.chainProviders
    .lookupAddress(address)
    .then((ens: string | null) => ens || address)
    .catch(() => address);

  return userAddress;
}

export default function useResolveEns({
  data,
  userAddress,
}: {
  data: StreamAndHistoryQuery | undefined;
  userAddress: string | undefined;
}) {
  const { chainId } = useNetworkProvider();

  return useQuery<IEnsResolve | null>(['ensAddresses', userAddress, chainId, data ? true : false], () =>
    resolveEns(data, userAddress)
  );
}

export function useGetEns(address: string) {
  const { chainId } = useNetworkProvider();

  return useQuery(['ensAdressOf', address, chainId], () => fetchEns(address));
}
