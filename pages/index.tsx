import type { GetStaticPropsContext } from 'next';
import * as React from 'react';
import Head from 'next/head';
import { useDialogState } from 'ariakit';
import Header from '~/components/Layout/Header';
import Hero from '~/components/Layout/Hero';
import HowItWorks from '~/components/Layout/HowItWorks';
import Footer from '~/components/Layout/Footer';
import Layout from '~/components/Layout';
import Balance from '~/components/Balance';
import { StreamSection } from '~/components/Stream';
import { HistorySection } from '~/components/History';

function Home() {
  const onboardDialog = useDialogState();
  const walletDialog = useDialogState();

  return (
    <Layout className="flex flex-col gap-12">
      <Balance />
      <StreamSection />
      <HistorySection />
    </Layout>
  );

  return (
    <>
      <Head>
        <title>LlamaPay</title>
        <meta
          name="description"
          content="LlamaPay is a multi-chain protocol that allows you to automate transactions and stream them by the second. The recipients can withdraw these funds at any time. This eliminates the need for manual transactions."
        />
      </Head>

      <Header onboardDialog={onboardDialog} walletDialog={walletDialog} />

      <Hero />

      <HowItWorks onboardDialog={onboardDialog} />

      <Footer />
    </>
  );
}

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
