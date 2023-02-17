import * as React from 'react';
import { useRouter } from 'next/router';
import Image, { StaticImageData } from 'next/image';
import { useTranslations } from 'next-intl';
import Layout from '~/components/Layout';
import { BalanceIcon } from '~/components/Icons';
import { AltStreamSection } from '~/components/Stream';
import { AltHistorySection } from '~/components/History';
import Balance from '~/components/Balance';
import { FallbackContainer } from '~/components/Fallback';
import { useFormatStreamAndHistory, useNetworkProvider } from '~/hooks';
import { useStreamAndHistoryQuery } from '~/services/generated/graphql';
import defaultImage from '~/public/empty-token.webp';

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
      refetchInterval: network ? 30000 : false,
    }
  );

  const { provider } = useNetworkProvider();

  const streamsAndHistory = useFormatStreamAndHistory({ data, address: resolvedAddress, provider });

  const t = useTranslations('Common');

  const { query } = useRouter();

  // TODO add translations
  return (
    <Layout className="flex flex-col gap-12">
      <div>
        <div className="section-header ml-0 max-w-fit">
          <div className="mt-[5px] flex items-center gap-[0.675rem] rounded bg-neutral-50 px-2 py-1 text-sm font-normal text-[#4E575F] dark:bg-[#202020] dark:text-white">
            <div className="flex items-center rounded-full">
              <Image
                src={logoURI || defaultImage}
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
        <>
          <Balance address={address} />

          <AltStreamSection isLoading={isLoading} isError={isError} data={streamsAndHistory} />

          <AltHistorySection isLoading={isLoading} isError={isError} data={streamsAndHistory} />
        </>
      ) : (
        <FallbackContainer>
          <p>{t('networkNotSupported')}</p>
        </FallbackContainer>
      )}
    </Layout>
  );
}
