import type { NextPage } from 'next';
import Layout from '../components/Layout';
import { Account, WalletSelector } from '../components/Web3';

const Home: NextPage = () => {
  return (
    <Layout className="items-center justify-center space-y-4">
      <h1 className="text-2xl">LlamaPay</h1>
      <Account />
      <WalletSelector />
    </Layout>
  );
};

export default Home;
