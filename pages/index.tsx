import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { StreamList } from 'components/Stream';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex items-center space-x-4">
        <h1>Streams</h1>
      </div>
      <div className="mt-2 flex flex-col border dark:border-zinc-800">
        <StreamList />
      </div>
    </Layout>
  );
};

export default Home;
