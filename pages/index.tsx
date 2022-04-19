import type { GetServerSideProps, NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import Balance from 'components/Balance';
import { HistoryTable } from 'components/History';
import { StreamTable } from 'components/Stream';
import { NO_BANNER } from 'utils/banner';

interface HomePageProps {
  noBanner: boolean;
}

const Home: NextPage<HomePageProps> = ({ noBanner }) => {
  return (
    <Layout className="mx-auto flex w-full flex-col items-center space-y-[30px]" noBanner={noBanner}>
      <Balance />
      <StreamTable />
      <HistoryTable />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  // Pass data to the page via props
  return { props: { noBanner: req.cookies[NO_BANNER] ?? false } };
};

export default Home;
