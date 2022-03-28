import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import Balance from 'components/Balance';

const Create: NextPage = () => {
  return (
    <Layout className="mx-auto mt-12 flex w-full max-w-7xl flex-col items-center space-y-6 xl:flex-row xl:items-start xl:justify-between xl:space-x-2 xl:space-y-0">
      <Balance />
      <CreateStream />
    </Layout>
  );
};

export default Create;
