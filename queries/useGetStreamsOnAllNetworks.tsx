import { useAccount } from 'wagmi';
import { useQuery } from 'react-query';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { chains, networkDetails } from 'utils/constants';

async function fetchStreams(address?: string) {
  try {
    if (!address) return [];

    const data = await Promise.all(
      chains.map((chain) =>
        useStreamAndHistoryQuery.fetcher(
          {
            endpoint: networkDetails[chain.id]?.subgraphEndpoint ?? '',
          },
          {
            id: address?.toLowerCase() ?? '',
            network: chain?.name ?? '',
          }
        )()
      )
    );

    return chains.map((chain, index) => ({
      id: chain.id,
      streams: data[index]?.user?.streams.length,
    }));
  } catch (error) {
    return null;
  }
}

const useGetStreamsOnAllNetworks = () => {
  const [{ data: accountData }] = useAccount();

  return useQuery(['allNetworkStreams', accountData?.address], () => fetchStreams(accountData?.address));
};

export default useGetStreamsOnAllNetworks;
