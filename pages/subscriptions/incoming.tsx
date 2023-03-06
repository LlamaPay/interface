import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import * as React from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { BeatLoader } from '~/components/BeatLoader';
import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import { NonRefundableTable } from '~/components/Subscriptions/NonRefundableTable';
import { RefundableTable } from '~/components/Subscriptions/RefundableTable';
import { SubscriptionsHistoryTable } from '~/components/Subscriptions/SubscriptionsHistoryTable';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import { useGetSubscriptionContracts, useGetSubscriptionContractsHistory } from '~/queries/useGetSubscriptions';

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chainId } = useNetworkProvider();

  const graphEndpoint = chainId ? networkDetails[chainId].subscriptionsSubgraph : null;

  const { data, isLoading, isError } = useGetSubscriptionContracts({ graphEndpoint });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: errorFetchingHistory,
  } = useGetSubscriptionContractsHistory({ graphEndpoint });

  const showFallback = !isConnected || !chain || chain?.unsupported;

  const t0 = useTranslations('Common');

  return (
    <Layout className="flex flex-col gap-8">
      {showFallback ? (
        <FallbackContainer>
          {!isConnected || !address ? (
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
                <BeatLoader size="6px" />
              </FallbackContainer>
            ) : isError ? (
              <FallbackContainer>
                <p>Something went wrong, couldn't fetch data</p>
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
              <RefundableTable data={data.refundables} userAddress={address as string} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-exo section-header m-0">Non Refundable</h1>
            {isLoading ? (
              <FallbackContainer>
                <BeatLoader size="6px" />
              </FallbackContainer>
            ) : isError ? (
              <FallbackContainer>
                <p>Something went wrong, couldn't fetch data</p>
              </FallbackContainer>
            ) : !data || data.nonRefundables.length === 0 ? (
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
              <NonRefundableTable data={data.nonRefundables} userAddress={address as string} />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="font-exo section-header m-0">History</h1>
            {fetchingHistory ? (
              <FallbackContainer>
                <BeatLoader size="6px" />
              </FallbackContainer>
            ) : errorFetchingHistory ? (
              <FallbackContainer>
                <p>Something went wrong, couldn't fetch data</p>
              </FallbackContainer>
            ) : !history || history.historyEvents.length === 0 ? (
              <FallbackContainer>
                <p>You dont have any history.</p>
              </FallbackContainer>
            ) : (
              <SubscriptionsHistoryTable data={history.historyEvents} />
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
