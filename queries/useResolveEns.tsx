import mainnetResolver from 'abis/mainnetResolver';
import { ethers } from 'ethers';
import { getAddress } from 'ethers/lib/utils';
import { useQuery } from 'react-query';
import { StreamAndHistoryQuery } from 'services/generated/graphql';
import { MAINNET_ENS_RESOLVER, networkDetails } from 'utils/constants';

interface IEnsResolve {
  [key: string]: string | null;
}

async function resolveEns(
  provider: ethers.providers.BaseProvider | null,
  data: StreamAndHistoryQuery | undefined,
  address: string | undefined
) {
  try {
    if (!provider) {
      throw new Error('No provider');
    } else if (!data) {
      throw new Error('No stream and history data');
    } else if (!address) {
      throw new Error('No Address');
    } else {
      const contract = new ethers.Contract(getAddress(MAINNET_ENS_RESOLVER), mainnetResolver, provider);
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
          h.stream?.payer.id.toLowerCase() === address.toLowerCase()
            ? h.stream.payee.id.toLowerCase()
            : h.stream?.payer.id.toLowerCase();

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
  } catch (error) {}
}

export default function useResolveEns({
  data,
  userAddress,
}: {
  data: StreamAndHistoryQuery | undefined;
  userAddress: string | undefined;
}) {
  const provider = networkDetails[1].chainProviders;
  return useQuery<IEnsResolve | undefined>(['ensAddresses', data, userAddress], () =>
    resolveEns(provider, data, userAddress)
  );
}
