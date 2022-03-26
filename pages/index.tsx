import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { CreateStream, StreamList } from 'components/Stream';
import { useState } from 'react';

const Home: NextPage = () => {
  const [createStream, setCreateStream] = useState(false);

  return (
    <Layout>
      <div className="flex items-center space-x-4">
        <h1>Streams</h1>
        <button
          className="rounded border border-zinc-200 py-[6px] px-2  hover:bg-zinc-100 dark:border-zinc-700 hover:dark:bg-zinc-800"
          onClick={() => setCreateStream(!createStream)}
        >
          + New Stream
        </button>
      </div>
      <div className="mt-2 flex flex-col border dark:border-zinc-800">
        <StreamList />
      </div>
      <CreateStream isOpen={createStream} setIsOpen={setCreateStream} />
    </Layout>
  );
};

export default Home;
