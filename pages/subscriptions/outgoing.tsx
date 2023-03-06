import type { GetServerSideProps, NextPage } from 'next';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { BeatLoader } from '~/components/BeatLoader';
import { FallbackContainer } from '~/components/Fallback';
import Layout from '~/components/Layout';
import { NonRefundableSubberTable } from '~/components/Subscriptions/NonRefundableSubberTable';
import { RefundableSubberTable } from '~/components/Subscriptions/RefundableSubberTable';
import { SubscriptionsHistoryTable } from '~/components/Subscriptions/SubscriptionsHistoryTable';
import { useNetworkProvider } from '~/hooks';
import { networkDetails } from '~/lib/networkDetails';
import { useGetSubberSubscriptionContracts, useGetSubscriptionContractsHistory } from '~/queries/useGetSubscriptions';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();
  const { chainId } = useNetworkProvider();

  const graphEndpoint = chainId ? networkDetails[chainId].subscriptionsSubgraph : null;

  const { data, isLoading, isError } = useGetSubberSubscriptionContracts({ graphEndpoint });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: errorFetchingHistory,
  } = useGetSubscriptionContractsHistory({ graphEndpoint, isSubber: true });

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
                <BeatLoader size="6px" />
              </FallbackContainer>
            ) : isError ? (
              <FallbackContainer>
                <p>Something went wrong, couldn't fetch data</p>
              </FallbackContainer>
            ) : !data || data.refundables.length === 0 ? (
              <FallbackContainer>
                <p>You dont have any active refundable subscriptions.</p>
              </FallbackContainer>
            ) : (
              <RefundableSubberTable data={data.refundables} />
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
            ) : !data || data.nonrefundables.length === 0 ? (
              <FallbackContainer>
                <p>You dont have any active non-refundable subscriptions.</p>
              </FallbackContainer>
            ) : (
              <NonRefundableSubberTable data={data.nonrefundables} />
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
