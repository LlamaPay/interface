import { dehydrate, QueryClient } from '@tanstack/react-query';
import { chainDetails } from '~/utils/network';
import { useStreamAndHistoryQuery } from '~/services/generated/graphql';
import defaultImage from '~/public/empty-token.webp';

interface ISalariesInfo {
  chain: string | string[] | undefined;
  address: string | string[] | undefined;
  locale: string | undefined;
}

export default async function getSalariesInfo({ chain, address, locale }: ISalariesInfo) {
  const { network, chain: c } = chainDetails(chain);

  const { network: mainnet } = chainDetails('1');

  const defaultAddress = typeof address === 'string' ? address : '';

  const userAddress = await mainnet?.chainProviders
    .resolveName(defaultAddress)
    .then((address) => address || defaultAddress)
    .catch(() => defaultAddress);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ['StreamAndHistory'],
    useStreamAndHistoryQuery.fetcher(
      {
        endpoint: network?.subgraphEndpoint ?? '',
      },
      {
        id: userAddress?.toLowerCase() ?? '',
        network: c?.name ?? '',
      }
    )
  );

  // Pass data to the page via props
  return {
    props: {
      subgraphEndpoint: network?.subgraphEndpoint ?? '',
      address,
      resolvedAddress: userAddress?.toLowerCase(),
      network: c?.name ?? null,
      logoURI: network?.logoURI ?? defaultImage,
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
}
