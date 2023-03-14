import type { GetStaticPropsContext, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import { useAccount, useNetwork } from 'wagmi';
import { networkDetails } from '~/lib/networkDetails';
import {
  useGetScheduledTransferPools,
  useGetScheduledTransfersHistory,
} from '~/queries/tokenSalary/useGetScheduledTransfers';
import { FallbackContainer, FallbackContainerLoader } from '~/components/Fallback';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ScheduledTransferPool } from '~/components/ScheduledTransfers/Pool';
import { ScheduledTransfersHistory } from '~/components/ScheduledTransfers/History';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  const { chain } = useNetwork();

  const graphEndpoint = chain ? networkDetails[chain.id]?.scheduledTransferSubgraph : null;

  const {
    data: pools,
    isLoading: fetchingPools,
    isError: failedToFetchPools,
  } = useGetScheduledTransferPools({ graphEndpoint });

  const {
    data: history,
    isLoading: fetchingHistory,
    isError: failedToFetchHistory,
  } = useGetScheduledTransfersHistory({ graphEndpoint, isPoolOwnersHistory: true });

  const t0 = useTranslations('Common');

  const showFallback = !isConnected || !chain || chain?.unsupported;

  const showPaymentFallabck = fetchingPools || failedToFetchPools || !pools || pools.length === 0;

  const showHistoryFallback = fetchingHistory || failedToFetchHistory || !history || history.length === 0;

  return (
    <Layout className="flex flex-col gap-12">
      {showFallback ? (
        <div>
          <h1 className="font-exo section-header">Your Contracts</h1>

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
            <h1 className="font-exo section-header">Your Contracts</h1>
            {showPaymentFallabck ? (
              <FallbackContainer>
                {fetchingPools ? (
                  <FallbackContainerLoader />
                ) : failedToFetchPools || !pools ? (
                  <p>{t0('error')}</p>
                ) : pools.length === 0 ? (
                  <p>
                    Create a{' '}
                    <Link href="/token-salaries/create" className="underline">
                      contract
                    </Link>{' '}
                    to schedule transfers
                  </p>
                ) : null}
              </FallbackContainer>
            ) : (
              <>
                {pools.map((pool) => (
                  <ScheduledTransferPool key={pool.poolContract} pool={pool} />
                ))}
              </>
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
                <ScheduledTransfersHistory history={history} isPoolOwnersHistory />
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
