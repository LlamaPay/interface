import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import Balance from 'components/Balance';
import { useAccount } from 'wagmi';

const Create: NextPage = () => {
  const [{ data: accountData }] = useAccount();

  return (
    <Layout className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center space-y-6 xl:flex-row xl:items-start xl:justify-between xl:space-x-2 xl:space-y-0">
      {!accountData ? (
        <p className="mx-auto mt-8 text-red-500">Connect wallet to continue</p>
      ) : (
        <>
          <Balance />
          <CreateStream />
        </>
      )}
    </Layout>
  );
};

export default Create;
