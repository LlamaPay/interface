import Layout from 'components/Layout';
import * as React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Vesting from 'components/Vesting';

const vesting: NextPage = () => {
  return (
    <Layout className="app-section mx-auto mt-12 flex w-full flex-col items-center space-y-6 pb-8 dark:bg-[#161818]">
      <Vesting />
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  // Pass data to the page via props
  return {
    props: {
      messages: (await import(`../translations/${locale}.json`)).default,
    },
  };
};

export default vesting;
