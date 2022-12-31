import { useAccount } from 'wagmi';
import { useQuery } from 'react-query';
import { useStreamAndHistoryQuery } from '~/services/generated/graphql';
import { networkDetails } from '~/lib/networkDetails';
import { chains } from '~/lib/chains';

async function fetchStreams(address?: string) {
  try {
    if (!address) return [];

    const res = await Promise.allSettled(
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

    const data = res.map((r) => (r.status === 'fulfilled' ? r.value : null));

    return chains.map((chain, index) => ({
      id: chain.id,
      streams: data[index]?.user?.streams.length,
    }));
  } catch (error) {
    // console.log(error);
    return null;
  }
}

const useGetStreamsOnAllNetworks = () => {
  const [{ data: accountData }] = useAccount();

  return useQuery(['allNetworkStreams', accountData?.address], () => fetchStreams(accountData?.address));
};

export default useGetStreamsOnAllNetworks;
