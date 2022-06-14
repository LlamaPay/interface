import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { dehydrate, QueryClient } from 'react-query';
import { chainDetails } from 'utils/network';
import { useStreamByIdQuery } from 'services/generated/graphql';
import { BalanceIcon } from 'components/Icons';

interface ClaimPageProps {
  streamId: string;
  network: string | null;
  subgraphEndpoint: string;
}

const Claim: NextPage<ClaimPageProps> = ({ subgraphEndpoint, streamId, network }) => {
  const { data, isLoading, isError } = useStreamByIdQuery(
    {
      endpoint: subgraphEndpoint,
    },
    {
      id: streamId,
      network: network || 'noNetwork',
    },
    {
      refetchInterval: network ? 10000 : false,
    }
  );

  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px] dark:bg-[#161818]">
      <section className="app-section">
        {/* <h1 className="font-exo flex items-center gap-[0.675rem] px-2 py-1 text-3xl dark:text-white">
          <span>
            <BalanceIcon width={30} height={36} />
          </span>
          <span>Claim</span>
        </h1> */}
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { chain, stream } = query;

  const id = typeof stream === 'string' ? stream : null;

  if (!chain || !stream || !id) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { network, chain: c } = chainDetails(chain);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    'StreamById',
    useStreamByIdQuery.fetcher(
      {
        endpoint: network?.subgraphEndpoint ?? '',
      },
      {
        id: id ?? '',
        network: c?.name ?? '',
      }
    )
  );

  // Pass data to the page via props
  return {
    props: {
      streamId: id,
      network: c?.name ?? null,
      subgraphEndpoint: network?.subgraphEndpoint ?? '',
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Claim;
