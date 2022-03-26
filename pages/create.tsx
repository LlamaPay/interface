import type { NextPage } from 'next';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';

const Create: NextPage = () => {
  return (
    <Layout>
      <CreateStream />
    </Layout>
  );
};

export default Create;
