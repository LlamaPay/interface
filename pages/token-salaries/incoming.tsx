import type { GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import { useAccount, useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import { useGetScheduledPayments, useGetScheduledTransfersHistory } from '~/queries/useGetScheduledTransfers';
import { FallbackContainer, FallbackContainerLoader } from '~/components/Fallback';
import { useTranslations } from 'next-intl';
import { ScheduledTransferPayment } from '~/components/ScheduledTransfers/Payment';
import { ScheduledTransfersHistory } from '~/components/ScheduledTransfers/History';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const graphEndpoint = chain?.id ? networkDetails[chain.id]?.scheduledTransferSubgraph : null;

  const {
    data: payments,
    isLoading: fetchingPayments,
    isError: failedToFetchPayments,
  } = useGetScheduledPayments({ graphEndpoint });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: failedToFetchHistory,
  } = useGetScheduledTransfersHistory({ graphEndpoint });

  const t0 = useTranslations('Common');

  const showFallback = !isConnected || !chain || chain?.unsupported;

  const showPaymentFallabck = fetchingPayments || failedToFetchPayments || !payments || payments.length === 0;

  const showHistoryFallback = fetchingHistory || failedToFetchHistory || !history || history.length === 0;

  return (
    <Layout className="flex flex-col gap-12">
      {showFallback ? (
        <div>
          <h1 className="font-exo section-header">Scheduled Payments</h1>

          <FallbackContainer>
            {!isConnected ? (
              <p>{t0('connectWallet')}</p>
            ) : !graphEndpoint || chain?.unsupported ? (
              <p>{t0('networkNotSupported')}</p>
            ) : null}
          </FallbackContainer>
        </div>
      ) : (
        <>
          <div>
            <h1 className="font-exo section-header">Scheduled Payments</h1>

            {showPaymentFallabck ? (
              <FallbackContainer>
                {fetchingPayments ? (
                  <FallbackContainerLoader />
                ) : failedToFetchPayments || !payments ? (
                  <p>{t0('error')}</p>
                ) : payments.length === 0 ? (
                  <p>You don't have any scheduled incoming payments</p>
                ) : null}
              </FallbackContainer>
            ) : (
              <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)] [&:not(:first-of-type)]:mt-4">
                <ScheduledTransferPayment payments={payments} isIncoming />
              </div>
            )}
          </div>

          <div>
            <h1 className="font-exo section-header">History</h1>

            {showHistoryFallback ? (
              <FallbackContainer>
                {fetchingHistory ? (
                  <FallbackContainerLoader />
                ) : failedToFetchHistory || !history ? (
                  <p>{t0('error')}</p>
                ) : history.length === 0 ? (
                  <p>You don't have any history</p>
                ) : null}
              </FallbackContainer>
            ) : (
              <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)] [&:not(:first-of-type)]:mt-4">
                <ScheduledTransfersHistory history={history} />
              </div>
            )}
          </div>
        </>
      )}
    </Layout>
  );
};

export async function getStaticProps(context: GetStaticPropsContext) {
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language.
      messages: (await import(`translations/${context.locale}.json`)).default,
    },
  };
}

export default Home;
