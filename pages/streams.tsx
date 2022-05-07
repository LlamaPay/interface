import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { BalanceIcon } from 'components/Icons';
import { dehydrate, QueryClient } from 'react-query';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import defaultImage from 'public/empty-token.webp';
import Image, { StaticImageData } from 'next/image';
import { getAddress } from 'ethers/lib/utils';
import { AltStreamSection } from 'components/Stream';
import { AltHistorySection } from 'components/History';
import { useFormatStreamAndHistory, useNetworkProvider } from 'hooks';
import { chainDetails } from 'utils/network';
import { useTranslations } from 'next-intl';

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

  const { provider } = useNetworkProvider();

  const streamsAndHistory = useFormatStreamAndHistory({ data, address, provider });

  const t = useTranslations('Common');

  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px]">
      <section className="app-section">
        <div>
          <div className="section-header ml-0 w-fit">
            <h1 className="font-exo px-2 py-1 text-3xl">{t('streamsAndHistory')}</h1>
            {network && (
              <div className="mt-[5px] flex flex-wrap items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F]">
                <div className="flex items-center rounded-full">
                  <Image
                    src={logoURI || defaultImage}
                    alt={t('logoAlt', { name: network })}
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
      <section className="app-section flex h-full flex-1 flex-col gap-[50px] bg-[#D9F2F4]/10 py-[22px]">
        <AltStreamSection isLoading={isLoading} isError={isError} data={streamsAndHistory} />
        <AltHistorySection isLoading={isLoading} isError={isError} data={streamsAndHistory} />
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
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
      messages: (await import(`../translations/${locale}.json`)).default,
    },
  };
};

export default Streams;
