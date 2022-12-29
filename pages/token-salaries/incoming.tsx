import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { useAccount, useNetwork } from 'wagmi';
import { networkDetails } from 'lib/networkDetails';
import { useGetScheduledPayments } from 'queries/useGetScheduledTransfers';
import { FallbackContainer, FallbackContainerLoader } from 'components/Fallback';
import { useTranslations } from 'next-intl';
import { ScheduledTransferPayment } from 'components/ScheduledTransfers/Payment';

const Home: NextPage = () => {
  const [{ data: accountData }] = useAccount();
  const [{ data: networkData }] = useNetwork();

  const graphEndpoint = networkData?.chain?.id ? networkDetails[networkData.chain.id]?.scheduledTransferSubgraph : null;

  const { data, isLoading, isError } = useGetScheduledPayments({ graphEndpoint });

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
        <h1 className="font-exo section-header">Scheduled Payments</h1>
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
              <p>You don't have any scheduled incoming payments</p>
            ) : null}
          </FallbackContainer>
        ) : (
          <div className="max-w-[calc(100vw-32px)] overflow-x-auto md:max-w-[calc(100vw-48px)] lg:max-w-[calc(100vw-256px)] [&:not(:first-of-type)]:mt-4">
            <ScheduledTransferPayment payments={data} isIncoming />
          </div>
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
