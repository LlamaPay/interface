import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import Balance from 'components/Balance';
import { HistoryTable } from 'components/History';
import { StreamTable } from 'components/Stream';

const Home: NextPage = () => {
  return (
    <Layout className="mx-auto flex w-full flex-col items-center space-y-[30px]">
      <Balance />
      <StreamTable />
      <HistoryTable />
    </Layout>
  );
};

export default Home;
