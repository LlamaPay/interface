import * as React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image, { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import Layout from 'components/Layout';
import { BalanceIcon } from 'components/Icons';
import { AltStreamSection } from 'components/Stream';
import { AltHistorySection } from 'components/History';
import Balance from 'components/Balance';
import { FallbackContainer } from 'components/Fallback';
import { useFormatStreamAndHistory, useNetworkProvider } from 'hooks';
import { useStreamAndHistoryQuery } from 'services/generated/graphql';
import defaultImage from 'public/empty-token.webp';
import { ArrowCircleLeftIcon } from '@heroicons/react/outline';

interface ISalaryProps {
  subgraphEndpoint: string;
  address: string;
  resolvedAddress: string;
  network: string;
  logoURI: StaticImageData;
}

export default function Salaries({ subgraphEndpoint, address, resolvedAddress, network, logoURI }: ISalaryProps) {
  const { data, isLoading, isError } = useStreamAndHistoryQuery(
    {
      endpoint: subgraphEndpoint,
    },
    {
      id: resolvedAddress,
      network: network,
    },
    {
      refetchInterval: network ? 20000 : false,
    }
  );

  const { provider } = useNetworkProvider();

  const streamsAndHistory = useFormatStreamAndHistory({ data, address: resolvedAddress, provider });

  const t = useTranslations('Common');

  const { query } = useRouter();

  // TODO add translations
  return (
    <Layout className="mt-12 flex w-full flex-col gap-[30px] dark:bg-[#161818]">
      <section className="app-section">
        <div>
          <Link href="/">
            <a className="relative top-[-18px] flex items-center gap-2">
              <ArrowCircleLeftIcon className="h-5 w-5" />
              <span>Home</span>
            </a>
          </Link>

          <div className="section-header ml-0 max-w-fit">
            <h1 className="font-exo py-1 text-3xl dark:text-white">Salaries</h1>

            <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
              <div className="flex items-center rounded-full">
                <Image
                  src={logoURI || defaultImage}
                  alt={network ? t('logoAlt', { name: network }) : 'Fallback Logo'}
                  objectFit="contain"
                  width="21px"
                  height="24px"
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
      </section>
      {network ? (
        <>
          <section className="app-section dark:bg-[#161818]">
            <Balance address={address} />
          </section>
          <section className="app-section flex h-full flex-1 flex-col gap-[50px] bg-[#D9F2F4]/10 py-[22px] dark:bg-[#161818]">
            <AltStreamSection isLoading={isLoading} isError={isError} data={streamsAndHistory} />
            <AltHistorySection isLoading={isLoading} isError={isError} data={streamsAndHistory} />
          </section>
        </>
      ) : (
        <section className="app-section">
          <FallbackContainer>
            <p>{t('networkNotSupported')}</p>
          </FallbackContainer>
        </section>
      )}
    </Layout>
  );
}
