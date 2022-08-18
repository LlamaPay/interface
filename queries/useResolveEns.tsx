import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useNetworkProvider } from 'hooks';
import { useQuery } from '@tanstack/react-query';
import { StreamAndHistoryQuery } from 'services/generated/graphql';
import { MAINNET_ENS_RESOLVER, networkDetails } from 'utils/constants';
import mainnetResolver from 'abis/mainnetResolver';
import { chainDetails } from 'utils/network';

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
      const contract = new ethers.Contract(getAddress(MAINNET_ENS_RESOLVER), mainnetResolver, mainnetProvider);
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

      const resolvedAddresses: IEnsResolve = {};

      for (let i = 0; i < resolveCall.length; i++) {
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
    .then((ens) => ens || address)
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
