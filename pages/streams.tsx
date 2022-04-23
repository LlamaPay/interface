import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { BalanceIcon, StreamCircle } from 'components/Icons';
import { networkDetails } from 'utils/constants';
import { dehydrate, QueryClient } from 'react-query';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import { allChains } from 'wagmi';
import defaultImage from 'public/empty-token.webp';
import Image, { StaticImageData } from 'next/image';
import { getAddress } from 'ethers/lib/utils';

interface StreamsProps {
  subgraphEndpoint: string;
  address: string;
  network: string;
  logoURI: StaticImageData;
}

const Streams: NextPage<StreamsProps> = ({ subgraphEndpoint, address, network, logoURI }) => {
  const { data, isLoading, isError } = useStreamAndHistoryQuery(
    {
      endpoint: subgraphEndpoint,
    },
    {
      id: address,
      network: network,
    },
    {
      refetchInterval: 10000,
    }
  );

  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col">
      <section>
        <div className="section-header flex items-center gap-[0.625rem]">
          <StreamCircle width="120px" height="120px" />
          <div>
            <h1 className="font-exo text-3xl">Streams and History</h1>
            {network && (
              <div className="mt-[5px] flex flex-wrap items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F]">
                <div className="flex items-center rounded-full">
                  <Image
                    src={logoURI || defaultImage}
                    alt={'Logo of ' + network}
                    objectFit="contain"
                    width="24px"
                    height="24px"
                  />
                </div>
                <p>{network}</p>
              </div>
            )}
            {address && (
              <div className="mt-[5px] flex flex-wrap items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F]">
                <BalanceIcon />
                <p>{getAddress(address)}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { chainId, address } = query;

  const userAddress = typeof address === 'string' ? address?.toLowerCase() : '';

  const { network, chain } = chainDetails(chainId);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    'StreamAndHistory',
    useStreamAndHistoryQuery.fetcher(
      {
        endpoint: network?.subgraphEndpoint ?? '',
      },
      {
        id: userAddress,
        network: chain?.name ?? '',
      }
    )
  );

  // Pass data to the page via props
  return {
    props: {
      subgraphEndpoint: network?.subgraphEndpoint ?? '',
      address: userAddress,
      network: chain?.name ?? '',
      logoURI: network?.logoURI ?? defaultImage,
      dehydratedState: dehydrate(queryClient),
    },
  };
};

function chainDetails(chainId: unknown) {
  const id = typeof chainId === 'string' ? Number(chainId) : 0;

  const network = networkDetails[id];
  const chain = allChains.find((c) => c.id === id);

  return { network, chain };
}

export default Streams;
