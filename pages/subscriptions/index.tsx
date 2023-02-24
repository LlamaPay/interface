import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import { NonRefundableTable } from '~/components/Subscriptions/NonRefundableTable';
import { RefundableTable } from '~/components/Subscriptions/RefundableTable';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import { useGetSubscriptionContracts } from '~/queries/useGetSubscriptions';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chainId } = useNetworkProvider();

  const graphEndpoint = chainId ? networkDetails[chainId].subscriptionsSubgraph : null;

  const { data, isLoading } = useGetSubscriptionContracts({ graphEndpoint });

  const showFallback = !isConnected || !chain || chain?.unsupported;

  const t0 = useTranslations('Common');

  return (
    <Layout className="flex flex-col gap-8">
      {showFallback ? (
        <FallbackContainer>
          {!isConnected ? (
            <p>{t0('connectWallet')}</p>
          ) : !graphEndpoint || chain?.unsupported ? (
            <p>{t0('networkNotSupported')}</p>
          ) : null}
        </FallbackContainer>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <h1 className="font-exo section-header m-0">Refundable</h1>
            {isLoading ? (
              <FallbackContainer>
                <></>
              </FallbackContainer>
            ) : !data || data.refundables.length === 0 ? (
              <FallbackContainer>
                <p>
                  You dont have any refundable subscription contracts, click{' '}
                  <Link href="/subscriptions/create" className="underline">
                    here
                  </Link>{' '}
                  to create one
                </p>
              </FallbackContainer>
            ) : (
              <RefundableTable data={data.refundables} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-exo section-header m-0">Non Refundable</h1>
            {isLoading ? (
              <FallbackContainer>
                <></>
              </FallbackContainer>
            ) : !data || data.nonrefundables.length === 0 ? (
              <FallbackContainer>
                <p>
                  You dont have any non refundable subscription contracts, click{' '}
                  <Link href="/subscriptions/create" className="underline">
                    here
                  </Link>{' '}
                  to create one
                </p>
              </FallbackContainer>
            ) : (
              <NonRefundableTable data={data.nonrefundables} />
            )}
          </div>
        </>
      )}
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
