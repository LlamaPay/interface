import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from '~/components/Layout';
import Balance from '~/components/Balance';
import { HistorySection } from '~/components/History';
import { StreamSection } from '~/components/Stream';

const Home: NextPage = () => {
  return (
    <Layout className="flex flex-col gap-12">
      <Balance />
      <StreamSection />
      <HistorySection />
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
