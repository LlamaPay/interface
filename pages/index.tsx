import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { StreamList } from 'components/Stream';
import { HistoryList } from 'components/History';

const Home: NextPage = () => {
  return (
    <Layout className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center space-y-6">
      <StreamList />
      <HistoryList />
    </Layout>
  );
};

export default Home;
