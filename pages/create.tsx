import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';
import Balance from 'components/Balance';

const Create: NextPage = () => {
  return (
    <Layout>
      <Balance />
      <CreateStream />
    </Layout>
  );
};

export default Create;
