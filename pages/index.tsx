import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { HistoryList, HistoryTable } from 'components/History';
import Balance from 'components/Balance';
import { StreamList, StreamTable } from 'components/Stream';

const Home: NextPage = () => {
  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col items-center space-y-6">
      <span className="mr-auto w-full">
        <Balance />
      </span>
      <StreamList />
      <HistoryList />

      {/* <StreamTable />
      <HistoryTable /> */}
    </Layout>
  );
};

export default Home;
