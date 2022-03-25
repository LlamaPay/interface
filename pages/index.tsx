import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { StreamList } from 'components/Stream';

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex items-center space-x-4">
        <h1>Streams</h1>
        {/* <button className="rounded border border-zinc-200 py-[6px] px-2  hover:bg-zinc-100 dark:border-zinc-700 hover:dark:bg-zinc-800">
          Create
        </button> */}
      </div>
      <div className="mt-2 flex flex-col border dark:border-zinc-800">
        <StreamList />
      </div>
    </Layout>
  );
};

export default Home;
