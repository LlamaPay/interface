import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import { useAccount, useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import { useGetScheduledTransferPools } from '~/queries/useGetScheduledTransfers';
import { FallbackContainer, FallbackContainerLoader } from '~/components/Fallback';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ScheduledTransferPool } from '~/components/ScheduledTransfers/Pool';

const Home: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const graphEndpoint = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.scheduledTransferSubgraph : null;

  const { data, isLoading, isError } = useGetScheduledTransferPools({ graphEndpoint });

  const t0 = useTranslations('Common');

  const showFallback =
    !accountData ||
    !networkData ||
    networkData.chain?.unsupported ||
    isLoading ||
    isError ||
    !data ||
    data.length === 0;

  return (
    <Layout className="flex flex-col gap-12">
      <div>
        <h1 className="font-exo section-header">Your Contracts</h1>
        {showFallback ? (
          <FallbackContainer>
            {!accountData ? (
              <p>{t0('connectWallet')}</p>
            ) : !graphEndpoint || networkData?.chain?.unsupported ? (
              <p>{t0('networkNotSupported')}</p>
            ) : isLoading ? (
              <FallbackContainerLoader />
            ) : isError || !data ? (
              <p>{t0('error')}</p>
            ) : data.length === 0 ? (
              <p>
                Create a{' '}
                <Link href="/token-salaries/create" passHref>
                  <a className="underline">contract</a>
                </Link>{' '}
                to schedule transfers
              </p>
            ) : null}
          </FallbackContainer>
        ) : (
          <>
            {data.map((pool) => (
              <ScheduledTransferPool key={pool.poolContract} pool={pool} />
            ))}
          </>
        )}
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`translations/${locale}.json`)).default,
    },
  };
};

export default Home;
