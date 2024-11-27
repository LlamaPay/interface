import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import { useRouter } from 'next/router';
import { StaticImageData } from 'next/image';
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import Layout from '~/components/Layout';
import { BalanceIcon } from '~/components/Icons';
import { AltVestingSection } from '~/components/Vesting';
import { FallbackContainer } from '~/components/Fallback';
import { useNetworkProvider } from '~/hooks';
import { useGetVestingInfoByQueryParams } from '~/queries/useGetVestingInfo';
import defaultImage from '~/public/empty-token.webp';
import { useStreamAndHistoryQuery } from '~/services/generated/graphql';
import { chainDetails } from '~/utils/network';

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

  const { query } = useRouter();

  const { provider } = useNetworkProvider();

  const { data, isLoading, error } = useGetVestingInfoByQueryParams({ address: resolvedAddress, provider, chainId });

  return (
    <Layout className="flex flex-col gap-12">
      <div>
        <div className="section-header ml-0 max-w-fit">
          <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
            <div className="flex items-center rounded-full">
              <img
                src={logoURI.src || defaultImage.src}
                alt={network ? t('logoAlt', { name: network }) : 'Fallback Logo'}
                className="object-contain"
                width={21}
                height={24}
              />
            </div>
            <p className="truncate whitespace-nowrap">{network || query.chain}</p>
          </div>

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

      {network ? (
        <AltVestingSection isLoading={isLoading} isError={error ? true : false} data={data} />
      ) : (
        <FallbackContainer>
          <p>{t('networkNotSupported')}</p>
        </FallbackContainer>
      )}
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
      chainId: c?.id ?? null,
      logoURI: network?.logoURI ?? defaultImage,
      dehydratedState: dehydrate(queryClient),
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Streams;
