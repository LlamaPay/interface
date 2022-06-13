import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { BalanceIcon } from 'components/Icons';
import { dehydrate, QueryClient } from 'react-query';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import defaultImage from 'public/empty-token.webp';
import Image, { StaticImageData } from 'next/image';
import { chainDetails } from 'utils/network';
import { useTranslations } from 'next-intl';
import { useGetVestingInfoByQueryParams } from 'queries/useGetVestingInfo';
import { useNetworkProvider } from 'hooks';
import { AltVestingSection } from 'components/Vesting';

interface StreamsProps {
  subgraphEndpoint: string;
  address: string;
  resolvedAddress: string;
  network: string;
  chainId: number | null;
  logoURI: StaticImageData;
}

const Streams: NextPage<StreamsProps> = ({ address, resolvedAddress, network, chainId, logoURI }) => {
  const t = useTranslations('Common');

  const { provider } = useNetworkProvider();

  const { data, isLoading, error } = useGetVestingInfoByQueryParams({ address: resolvedAddress, provider, chainId });

  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px] dark:bg-[#161818]">
      <section className="app-section">
        <div>
          <div className="section-header ml-0 max-w-fit">
            <h1 className="font-exo px-0 py-1 text-3xl dark:text-white">Vesting</h1>
            {network && (
              <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
                <div className="flex items-center rounded-full">
                  <Image
                    src={logoURI || defaultImage}
                    alt={t('logoAlt', { name: network })}
                    objectFit="contain"
                    width="21px"
                    height="24px"
                  />
                </div>
                <p className="truncate whitespace-nowrap">{network}</p>
              </div>
            )}
            {address && (
              <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
                <BalanceIcon />
                <p className="space-x-1 truncate whitespace-nowrap">
                  <span>{address}</span>
                  {address.toLowerCase() !== resolvedAddress.toLowerCase() && (
                    <span className="hidden md:inline-block">{` (${resolvedAddress})`}</span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="app-section flex h-full flex-1 flex-col gap-[50px] bg-[#D9F2F4]/10 py-[22px] dark:bg-[#161818]">
        <AltVestingSection isLoading={isLoading} isError={error ? true : false} data={data} />
      </section>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
  const { chain, address } = query;

  const { network, chain: c } = chainDetails(chain);

  const { network: mainnet } = chainDetails('1');

  const defaultAddress = typeof address === 'string' ? address : '';

  const userAddress = await mainnet?.chainProviders
    .resolveName(defaultAddress)
    .then((address) => address || defaultAddress)
    .catch(() => defaultAddress);

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    'StreamAndHistory',
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
      network: c?.name ?? '',
      chainId: c?.id ?? null,
      logoURI: network?.logoURI ?? defaultImage,
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Streams;
