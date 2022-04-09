import type { NextPage } from 'next';
import * as React from 'react';
import Layout from 'components/Layout';
import { CreateStream } from 'components/Stream';

const Create: NextPage = () => {
  return (
    <Layout className="mx-auto mt-12 flex w-full flex-col items-center space-y-6">
      <CreateStream />
    </Layout>
  );
};

export default Create;
