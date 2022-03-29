import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { StreamList } from 'components/Stream';
import { HistoryList } from 'components/History';
import { useAccount } from 'wagmi';

const Home: NextPage = () => {
  const [{ data: accountData }] = useAccount();

  return (
    <Layout className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center space-y-6">
      {!accountData ? (
        <p className="mx-auto mt-8 text-red-500">Connect wallet to continue</p>
      ) : (
        <>
          <StreamList />
          <HistoryList />
        </>
      )}
    </Layout>
  );
};

export default Home;
