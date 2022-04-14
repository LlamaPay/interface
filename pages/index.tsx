import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { HistoryTable } from 'components/History';
import Balance from 'components/Balance';
import { StreamTable } from 'components/Stream';

const Home: NextPage = () => {
  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col items-center space-y-6">
      <Balance />
      <StreamTable />
      <HistoryTable />
    </Layout>
  );
};

export default Home;
